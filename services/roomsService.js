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

async function getAll() {
    const query = `SELECT * FROM rooms FORMAT JSON`;
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

async function getReport() {
    const query = `
        SELECT 
            type,
            COUNT(*) as total,
            SUM(CASE WHEN status = 'В аренде' THEN 1 ELSE 0 END) as rented,
            ROUND(100.0 * SUM(CASE WHEN status = 'В аренде' THEN 1 ELSE 0 END) / COUNT(*), 2) as rented_percentage,
            ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM rooms), 2) as type_percentage
        FROM 
            rooms
        GROUP BY 
            type FORMAT JSON`;
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

module.exports = {
    getAll,
    getReport,
};
