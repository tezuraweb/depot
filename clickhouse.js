const { createClient } = require('@clickhouse/client');

const client = createClient({
    url: 'https://rc1a-pmdjlceohah0jidf.mdb.yandexcloud.net',
    username: 'nna',
    password: 'rjog5qnr',
    database: 'arenda',
    port: '8443',
    timeout: 50000,
})

module.exports = client;