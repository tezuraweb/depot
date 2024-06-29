const clickhouse = require('../clickhouse');

class Premises {
    constructor() {
        this.db = clickhouse;
        this.tableName = "rooms";
        // console.log(clickhouse);
    }

    async getPremises() {
        try {
            const query = `SELECT * FROM ${this.tableName}`;
            console.log('Executing query:', query);
            const rows = await this.db.query({
                query,
                format: 'JSONEachRow',
            });
            console.log('Query executed successfully');
            const dataset = await rows.json();
            console.log('Dataset fetched:', dataset);
            return dataset;
        } catch (error) {
            console.error('Error fetching premises:', error);
            throw error;
        }
    }
}

module.exports = new Premises();