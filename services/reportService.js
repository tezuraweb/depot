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
    var sanitizedOrg = ['ДЕПО АО'].map(item => sqlstring.escape(item)).join(', ');
} else if (appConfig.base === 'gagarinsky') {
    var sanitizedOrg = ['ГАГАРИНСКИЙ ПКЦ ООО'].map(item => sqlstring.escape(item)).join(', ');
} else if (appConfig.base === 'yujnaya') {
    var sanitizedOrg = ['База Южная ООО', 'Строительная База "Южная" ООО'].map(item => sqlstring.escape(item)).join(', ');
}

const typesToExclude = ['Помещение вспомогательное'].map(item => sqlstring.escape(item)).join(', ')

async function getReport() {
    const query = `SELECT * FROM report WHERE Organization IN (${sanitizedOrg}) AND typeRooms NOT IN (${typesToExclude}) FORMAT JSON`;
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

module.exports = {
    getReport,
};