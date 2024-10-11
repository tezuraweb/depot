const axios = require('axios');
const querystring = require('querystring');
const sqlstring = require('sqlstring');
const appConfig = require('../config/appConfig');
const dbConfig = require('../config/dbConfig');

const dbOptions = {
    baseURL: `https://${dbConfig.host}:8443`,
    method: 'POST',
    headers: {
        'X-ClickHouse-User': dbConfig.user,
        'X-ClickHouse-Key': dbConfig.password,
    },
    httpsAgent: new (require('https').Agent)({
        ca: dbConfig.ca,
    }),
};

if (appConfig.base === 'depo') {
    var baseName = 'ДЕПО АО';
    var sanitizedOrg = ['ДЕПО АО'].map(item => sqlstring.escape(item)).join(', ');
} else if (appConfig.base === 'gagarinsky') {
    var baseName = 'ГАГАРИНСКИЙ ПКЦ ООО';
    var sanitizedOrg = ['ГАГАРИНСКИЙ ПКЦ ООО'].map(item => sqlstring.escape(item)).join(', ');
} else if (appConfig.base === 'yujnaya') {
    var baseName = 'База Южная ООО';
    var sanitizedOrg = ['База Южная ООО', 'Строительная База "Южная" ООО'].map(item => sqlstring.escape(item)).join(', ');
}

async function getAll() {
    const query = `SELECT * FROM residents WHERE base IN (${sanitizedOrg}) FORMAT JSON`;
    const queryParams = querystring.stringify({
        'database': dbConfig.database,
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

async function alterResidentById(data) {
    const id = data.id;
    delete data.id;

    const updates = Object.keys(data).map(key => `${sqlstring.escapeId(key)} = ${sqlstring.escape(data[key])}`).join(', ');
    const query = `ALTER TABLE residents UPDATE ${updates} WHERE id = ${sqlstring.escape(id)}`;
    const queryParams = querystring.stringify({
        'database': dbConfig.database,
        'query': query,
    });

    try {
        await axios.post(`/?${queryParams}`, null, dbOptions);
        return { success: true };
    } catch (error) {
        throw error;
    }
}

async function insertResident(data) {
    data.base = baseName;

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

    const query = `
        INSERT INTO residents (id, ${keys})
        SELECT max(id) + 1, ${values}
        FROM residents
    `;
    const queryParams = querystring.stringify({
        'database': dbConfig.database,
        'query': query,
    });

    try {
        await axios.post(`/?${queryParams}`, null, dbOptions);
        return { success: true };
    } catch (error) {
        throw error;
    }
}

async function deleteResident(id) {
    const query = `
        DELETE FROM residents
        WHERE id = ${sqlstring.escape(id)}
    `;
    const queryParams = querystring.stringify({
        'database': dbConfig.database,
        'query': query,
    });

    try {
        await axios.post(`/?${queryParams}`, null, dbOptions);
        return { success: true };
    } catch (error) {
        throw error;
    }
}

async function updatePhotoById(id, fileUrl) {
    const getPreviousLogoQuery = `
        SELECT logo FROM residents
        WHERE id = ${sqlstring.escape(id)}
        LIMIT 1
    `;
    
    const updateLogoQuery = `
        ALTER TABLE residents
        UPDATE logo = '${sqlstring.escape(fileUrl).replace(/'/g, '')}'
        WHERE id = ${sqlstring.escape(id)}
    `;

    try {
        const getQueryParams = querystring.stringify({
            'database': dbConfig.database,
            'query': getPreviousLogoQuery,
        });

        const getResponse = await axios.get(`/?${getQueryParams}`, dbOptions);
        const previousLogo = getResponse.data.trim();

        const updateQueryParams = querystring.stringify({
            'database': dbConfig.database,
            'query': updateLogoQuery,
        });

        await axios.post(`/?${updateQueryParams}`, null, dbOptions);

        return { success: true, previousLogo };
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAll,
    alterResidentById,
    insertResident,
    deleteResident,
    updatePhotoById,
};
