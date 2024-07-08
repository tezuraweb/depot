const axios = require('axios');
const querystring = require('querystring');
const sqlstring = require('sqlstring');
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

function generateUniqueTicketNumber() {
    return Math.floor(Math.random() * 1000000000);
}

async function getTicketById(id) {
    const sanitizedId = sqlstring.escape(id);
    const query = `SELECT * FROM ticket WHERE id = ${sanitizedId} FORMAT JSON`;
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
    const sanitizedOffcet = sqlstring.escape(offset);
    const sanitizedLimit = sqlstring.escape(limit);
    const query = `
        SELECT * 
        FROM (
            SELECT *, 
                row_number() OVER (PARTITION BY ticket_number ORDER BY date DESC) AS rn
            FROM ticket 
            WHERE inquirer = ${sanitizedId}
        ) 
        WHERE rn = 1
        ORDER BY date DESC
        LIMIT ${sanitizedLimit} OFFSET ${sanitizedOffcet}
        FORMAT JSON
    `;
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

async function getTicketByNumber(number) {
    const sanitizedNumber = sqlstring.escape(number);
    const query = `
        SELECT * FROM ticket WHERE ticket_number = ${sanitizedNumber} ORDER BY date FORMAT JSON`;
        
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

async function getTicketByStatusTg(status, offset, limit) {
    const sanitizedStatus = sqlstring.escape(status);
    const sanitizedOffcet = sqlstring.escape(offset);
    const sanitizedLimit = sqlstring.escape(limit);
    const query = `
        SELECT * 
        FROM (
            SELECT *, 
                row_number() OVER (PARTITION BY ticket_number ORDER BY date DESC) AS rn
            FROM ticket 
            WHERE status = ${sanitizedStatus}
        ) 
        WHERE rn = 1
        ORDER BY date DESC
        LIMIT ${sanitizedLimit} OFFSET ${sanitizedOffcet}
        FORMAT JSON
    `;
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

async function insertTicket(data) {
    if (data.isNew) {
        data.ticket_number = generateUniqueTicketNumber();
        data.status = 'new';
    } else {
        data.status = 'in_process';
    }
    data.date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    delete data.isNew;

    const keys = Object.keys(data).map(key => sqlstring.escapeId(key)).join(', ');
    const values = Object.keys(data).map(key => {
        if (Array.isArray(data[key])) {
            if (data[key].length > 0) {
                return `['${data[key].map(item => sqlstring.escape(item).replace(/'/g, "")).join("', '")}']`;
            } else {
                return `[]`;
            }
        }
        return sqlstring.escape(data[key]);
    }).join(', ');

    const query = `INSERT INTO ticket (${keys}) VALUES (${values})`;
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
    getTicketByUserTg,
    getTicketByStatusTg,
    getTicketByNumber,
};
