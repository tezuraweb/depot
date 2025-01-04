const axios = require('axios');
const querystring = require('querystring');
const sqlstring = require('sqlstring');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/dbConfig');

const dbOptions = {
    baseURL: `https://${config.host}:8443`,
    method: 'POST',
    headers: {
        'X-ClickHouse-User': config.user,
        'X-ClickHouse-Key': config.password,
    },
    httpsAgent: new (require('https').Agent)({
        ca: config.ca,
    }),
};

async function getTicketById(id) {
    const sanitizedId = sqlstring.escape(id);
    const query = `
        SELECT 
            t.id as id,
            t.inquirer as inquirer,
            t.status as status,
            t.manager as manager,
            t.inquirer_username as inquirer_username,
            m.text as text,
            m.files as files,
            m.photos as photos,
            m.date as date
        FROM ticket t
        LEFT JOIN ticket_message m ON t.id = m.ticket_id
        WHERE t.id = ${sanitizedId}
        ORDER BY m.date DESC
        FORMAT JSON`;

    const queryParams = querystring.stringify({
        'database': config.database,
        'query': query,
    });

    try {
        const response = await axios({
            ...dbOptions,
            method: 'GET',
            url: `/?${queryParams}`,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function getTicketsByTenant(id) {
    const sanitizedId = sqlstring.escape(id);
    const query = `
        SELECT 
            t.id as id,
            t.status as status,
            t.manager as manager,
            m.text as text,
            m.date as date,
            m.reply as reply
        FROM ticket t
        JOIN tenants ten ON t.inquirer_username = ten.tg_user
        LEFT JOIN ticket_message m ON t.id = m.ticket_id
        WHERE ten.id = ${sanitizedId}
        FORMAT JSON`;

    const queryParams = querystring.stringify({
        'database': config.database,
        'query': query,
    });

    try {
        const response = await axios({
            ...dbOptions,
            method: 'GET',
            url: `/?${queryParams}`,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function getTicketByUserTg(id, offset, limit) {
    const sanitizedId = sqlstring.escape(id);
    const sanitizedOffset = sqlstring.escape(offset);
    const sanitizedLimit = sqlstring.escape(limit);

    const query = `
        SELECT
            t.id as id,
            t.inquirer as inquirer,
            t.status as status,
            t.manager as manager,
            t.inquirer_username as inquirer_username,
            m.text as text,
            m.files as files,
            m.photos as photos,
            m.date as date
        FROM ticket t
        LEFT JOIN (
            SELECT ticket_id, text, files, photos, date,
                row_number() OVER (PARTITION BY ticket_id ORDER BY date DESC) as rn
            FROM ticket_message
        ) m ON t.id = m.ticket_id AND m.rn = 1
        WHERE t.inquirer = ${sanitizedId}
        AND t.status != 'closed'
        ORDER BY m.date
        LIMIT ${sanitizedLimit} OFFSET ${sanitizedOffset}
        FORMAT JSON`;

    const queryParams = querystring.stringify({
        'database': config.database,
        'query': query,
    });

    try {
        const response = await axios({
            ...dbOptions,
            method: 'GET',
            url: `/?${queryParams}`,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function getTicketByStatusTg(status, offset, limit, base) {
    const sanitizedStatus = sqlstring.escape(status);
    const sanitizedOffset = sqlstring.escape(offset);
    const sanitizedLimit = sqlstring.escape(limit);
    const sanitizedBase = sqlstring.escape(base);

    const query = `
        SELECT
            t.id as id,
            t.inquirer as inquirer,
            t.status as status,
            t.manager as manager,
            t.inquirer_username as inquirer_username,
            m.text as text,
            m.files as files,
            m.photos as photos,
            m.date as date,
            u.name AS username
        FROM ticket t
        JOIN tenants u ON t.inquirer_username = u.tg_user
        LEFT JOIN (
            SELECT ticket_id, text, files, photos, date,
                row_number() OVER (PARTITION BY ticket_id ORDER BY date DESC) as rn
            FROM ticket_message
        ) m ON t.id = m.ticket_id AND m.rn = 1
        WHERE t.status = ${sanitizedStatus}
            AND u.organization = ${sanitizedBase}
        ORDER BY m.date
        LIMIT ${sanitizedLimit} OFFSET ${sanitizedOffset}
        FORMAT JSON`;

    const queryParams = querystring.stringify({
        'database': config.database,
        'query': query,
    });

    try {
        const response = await axios({
            ...dbOptions,
            method: 'GET',
            url: `/?${queryParams}`,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function updateTicket(id, data) {
    const sanitizedId = sqlstring.escape(id);

    const { id: _, ...updateData } = data;

    const updates = Object.keys(updateData)
        .filter(key => updateData[key] !== undefined)
        .map(key => `${sqlstring.escapeId(key)} = ${sqlstring.escape(updateData[key])}`)
        .join(', ');

    if (!updates) {
        throw new Error('No valid fields to update');
    }

    const query = `
        ALTER TABLE ticket
        UPDATE ${updates}
        WHERE id = ${sanitizedId}
    `;

    const queryParams = querystring.stringify({
        'database': config.database,
        'query': query,
    });

    try {
        const response = await axios.post(`/?${queryParams}`, null, dbOptions);

        return response.data;
    } catch (error) {
        throw error;
    }
}

async function addTicketMessage(data) {
    try {
        await insertTicketMessage({
            ticket_id: data.id,
            text: data.text,
            date: new Date().toISOString().slice(0, 19).replace('T', ' '),
            files: data.files || [],
            photos: data.photos || [],
            reply: data.reply || 0,
        });

        const newData = data.manager ? {
            status: data.isNew ? 'new' : 'in_process',
            manager: data.manager
        } : {
            status: data.isNew ? 'new' : 'in_process'
        };

        await updateTicket(
            data.id,
            newData
        );

        return data.id;
    } catch (error) {
        throw error;
    }
}

async function insertTicket(data) {
    // Generate UUID first
    const ticketId = uuidv4();

    // Add it to ticket data
    const ticketData = {
        id: ticketId,
        inquirer: data.inquirer,
        inquirer_username: data.inquirer_username,
        status: data.isNew ? 'new' : 'in_process',
        manager: data.manager || ''
    };

    const ticketKeys = Object.keys(ticketData).map(key => sqlstring.escapeId(key)).join(', ');
    const ticketValues = Object.keys(ticketData).map(key => sqlstring.escape(ticketData[key])).join(', ');

    const ticketQuery = `INSERT INTO ticket (${ticketKeys}) VALUES (${ticketValues})`;
    const queryParams = querystring.stringify({
        'database': config.database,
        'query': ticketQuery,
    });

    try {
        await axios.post(`/?${queryParams}`, null, dbOptions);

        // Insert initial message
        await insertTicketMessage({
            ticket_id: ticketId,
            text: data.text,
            date: new Date().toISOString().slice(0, 19).replace('T', ' '),
            files: data.files || [],
            photos: data.photos || [],
            reply: data.reply || 0,
        });

        return ticketId;
    } catch (error) {
        throw error;
    }
}

async function insertTicketBackoffice(data) {
    const userId = sqlstring.escape(data.userId);
    const ticketId = uuidv4();

    const inquirerUsernameSubquery = `(SELECT tg_user FROM tenants WHERE id = ${userId} LIMIT 1)`;
    const inquirerSubquery = `(SELECT tg_id FROM tenants WHERE id = ${userId} LIMIT 1)`;

    // Insert ticket
    const ticketQuery = `
        INSERT INTO ticket (id, status, inquirer_username, inquirer)
        VALUES ('${ticketId}', 'new', ${inquirerUsernameSubquery}, ${inquirerSubquery})`;

    const queryParams = querystring.stringify({
        'database': config.database,
        'query': ticketQuery,
    });

    try {
        await axios.post(`/?${queryParams}`, null, dbOptions);

        // Insert message
        await insertTicketMessage({
            ticket_id: ticketId,
            text: data.text,
            date: new Date().toISOString().slice(0, 19).replace('T', ' '),
            files: [],
            photos: [],
            reply: 0,
        });

        return ticketId;
    } catch (error) {
        throw error;
    }
}

async function insertTicketMessage(data) {
    const keys = Object.keys(data).map(key => sqlstring.escapeId(key)).join(', ');
    const values = Object.keys(data).map(key => {
        if (Array.isArray(data[key])) {
            if (data[key].length > 0) {
                return `['${data[key].map(item => sqlstring.escape(item).replace(/'/g, "")).join("', '")}']`;
            }
            return '[]';
        }
        return sqlstring.escape(data[key]);
    }).join(', ');

    const query = `INSERT INTO ticket_message (${keys}) VALUES (${values})`;
    const queryParams = querystring.stringify({
        'database': config.database,
        'query': query,
    });

    try {
        const response = await axios.post(`/?${queryParams}`, null, dbOptions);
        return response.data;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getTicketById,
    insertTicket,
    insertTicketBackoffice,
    getTicketByUserTg,
    getTicketByStatusTg,
    updateTicket,
    getTicketsByTenant,
    insertTicketMessage,
    addTicketMessage
};