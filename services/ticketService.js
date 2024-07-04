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

async function insertTicket(data) {
    if (data.isNew) {
        data.ticket_number = generateUniqueTicketNumber();
        data.status = 'Новое',
        data.date =  new Date(),
        delete data.isNew;
    }

    const keys = Object.keys(data).map(key => sqlstring.escapeId(key)).join(', ');
    const values = Object.keys(data).map(key => {
        if (Array.isArray(data[key])) {
            return `['${data[key].map(item => sqlstring.escape(item).replace(/'/g, "")).join("', '")}']`;
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
};
