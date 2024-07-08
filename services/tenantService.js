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

async function getTenantById(id) {
    const sanitizedId = sqlstring.escape(id);
    const query = `SELECT * FROM tenants WHERE id = ${sanitizedId} FORMAT JSON`;
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

async function getTenantByTgId(id) {
    const sanitizedId = sqlstring.escape(id);
    const query = `SELECT id, name, tg_id FROM tenants WHERE tg_id = ${sanitizedId} LIMIT 1 FORMAT JSON`;
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

async function insertTenant(data) {
    const keys = Object.keys(data).map(key => sqlstring.escapeId(key)).join(', ');
    const values = Object.keys(data).map(key => sqlstring.escape(data[key])).join(', ');
    const query = `INSERT INTO tenants (${keys}) VALUES (${values})`;
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

async function deleteTenantById(id) {
    const sanitizedId = sqlstring.escape(id);
    const query = `ALTER TABLE tenants DELETE WHERE id = ${sanitizedId}`;
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

async function alterTenantById(id, newData) {
    try {
        const currentTenant = await getTenantById(id);
        if (!currentTenant || !currentTenant.data) {
            throw new Error('Tenant not found');
        }

        const updatedTenant = { ...currentTenant.data[0], ...newData };
        await deleteTenantById(id);
        await insertTenant(updatedTenant);

        return updatedTenant;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getTenantById,
    getTenantByTgId,
    alterTenantById,
};
