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
const statusVacant = sqlstring.escape('Свободен');

async function getAll() {
    const query = `SELECT * FROM rooms WHERE organization IN (${sanitizedOrg}) AND type NOT IN (${typesToExclude}) FORMAT JSON`;
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

async function getTypes() {
    const query = `
        SELECT DISTINCT type
        FROM rooms
        WHERE organization IN (${sanitizedOrg})
        AND type NOT IN (${typesToExclude})
        AND status = ${statusVacant}
        FORMAT JSON`;

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

async function getFloors() {
    const query = `
        SELECT DISTINCT floor
        FROM rooms
        WHERE organization IN (${sanitizedOrg})
        AND type NOT IN (${typesToExclude})
        AND status = ${statusVacant}
        FORMAT JSON`;

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

async function getRoomsAmounts() {
    const query = `
        SELECT DISTINCT length(floor_ids) AS amount
        FROM rooms
        WHERE organization IN (${sanitizedOrg})
        AND type NOT IN (${typesToExclude})
        AND status = ${statusVacant}
        FORMAT JSON`;

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


async function getIdLiter() {
    const query = `
        SELECT DISTINCT key_liter, key_liter_id
        FROM rooms
        WHERE organization IN (${sanitizedOrg})
        AND type NOT IN (${typesToExclude})
        AND status = ${statusVacant}
        FORMAT JSON`;

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

async function getRoomsByTenant(id) {
    const sanitizedId = sqlstring.escape(id);
    const query = `
        SELECT 
            rooms.id, 
            rooms.room, 
            rooms.type, 
            rooms.cost, 
            rooms.area, 
            rooms.floor, 
            rooms.ceiling, 
            rooms.promotion,
            rooms.date_k AS date,
            rooms.images
        FROM rooms 
        JOIN tenants 
        ON rooms.tenant = tenants.id 
        WHERE tenants.id = ${sanitizedId} 
        FORMAT JSON`;
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

async function getPage(data) {
    const conditions = [];

    if (data.code) conditions.push(`id LIKE '%${sqlstring.escape(data.code).replace(/^'|'$/g, "")}%'`);
    if (data.id_liter) conditions.push(`key_liter_id = ${sqlstring.escape(data.id_liter)}`);
    if (data.floor) conditions.push(`floor = ${sqlstring.escape(data.floor)}`);
    if (data.ceiling) conditions.push(`ceiling = ${sqlstring.escape(data.ceiling)}`);
    if (data.promotion) conditions.push(`promotion = ${sqlstring.escape(data.promotion)}`);
    if (data.roomsAmount) conditions.push(`length(floor_ids) = ${sqlstring.escape(data.roomsAmount)}`);

    if (data.type) {
        conditions.push(`type = ${sqlstring.escape(data.type)}`);
    } else {
        conditions.push(`type NOT IN ${typesToExclude}`);
    }

    if (data.areaFrom !== undefined && data.areaTo !== undefined) {
        conditions.push(`area BETWEEN ${sqlstring.escape(data.areaFrom)} AND ${sqlstring.escape(data.areaTo)}`);
    } else if (data.areaFrom !== undefined) {
        conditions.push(`area >= ${sqlstring.escape(data.areaFrom)}`);
    } else if (data.areaTo !== undefined) {
        conditions.push(`area <= ${sqlstring.escape(data.areaTo)}`);
    }

    if (data.organization !== undefined && Array.isArray(data.organization) && data.organization.length > 0) {
        conditions.push(`organization IN (${data.organization.map(item => sqlstring.escape(item)).join(', ')})`);
    } else {
        conditions.push(`organization IN (${sanitizedOrg})`);
    }

    if (data.priceType === 'total') {
        if (data.priceFrom !== undefined && data.priceTo !== undefined) {
            conditions.push(`cost * area BETWEEN ${sqlstring.escape(data.priceFrom)} AND ${sqlstring.escape(data.priceTo)}`);
        } else if (data.priceFrom !== undefined) {
            conditions.push(`cost * area >= ${sqlstring.escape(data.priceFrom)}`);
        } else if (data.priceTo !== undefined) {
            conditions.push(`cost * area <= ${sqlstring.escape(data.priceTo)}`);
        }
    } else {
        if (data.priceFrom !== undefined && data.priceTo !== undefined) {
            conditions.push(`cost BETWEEN ${sqlstring.escape(data.priceFrom)} AND ${sqlstring.escape(data.priceTo)}`);
        } else if (data.priceFrom !== undefined) {
            conditions.push(`cost >= ${sqlstring.escape(data.priceFrom)}`);
        } else if (data.priceTo !== undefined) {
            conditions.push(`cost <= ${sqlstring.escape(data.priceTo)}`);
        }
    }

    conditions.push(`status = ${statusVacant}`);

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `
        SELECT id, room, type, key_liter, cost, area, floor, ceiling, promotion, promotion_price, images, floor_ids AS room_codes, length(floor_ids) AS amount, organization
        FROM rooms 
        ${whereClause}
        ORDER BY promotion DESC, cost ${data.priceDesc ? 'DESC' : ''}, id
        LIMIT ${data.limit}
        OFFSET ${data.offset}
        FORMAT JSON`;
    const queryParams = querystring.stringify({
        'database': dbConfig.database,
        'query': query,
    });

    try {
        const response = await axios({
            ...dbOptions,
            url: `/?${queryParams}`,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function getReport(base) {
    const sanitizedBase = base.map(item => sqlstring.escape(item)).join(', ');
    const query = `
        SELECT 
            type,
            COUNT(*) as total,
            SUM(CASE WHEN status = 'В аренде' THEN 1 ELSE 0 END) as rented,
            ROUND(100.0 * SUM(CASE WHEN status = 'В аренде' THEN 1 ELSE 0 END) / COUNT(*), 2) as rented_percentage,
            ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM rooms WHERE organization IN (${sanitizedBase})), 2) as type_percentage
        FROM 
            rooms
        WHERE
            organization IN (${sanitizedBase})
        GROUP BY 
            type
        FORMAT JSON`;
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

async function getRoomById(id) {
    const sanitizedId = sqlstring.escape(id);
    const query = `
        SELECT id, room, type, key_liter, key_liter_id, cost, area, floor, ceiling, text, promotion, promotion_price, floor_ids AS room_codes, images
        FROM rooms
        WHERE id = ${sanitizedId}
        AND organization IN (${sanitizedOrg})
        LIMIT 1
        FORMAT JSON`;
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

async function getRoomsByParam(params) {
    const conditions = Object.keys(params)
        .map(key => `${sqlstring.escapeId(key)} = ${sqlstring.escape(params[key])}`)
        .join(' AND ');

    const query = `
        SELECT id, floor_ids AS room_codes
        FROM rooms
        WHERE ${conditions} AND organization IN (${sanitizedOrg})
        FORMAT JSON`;
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

async function getRecommended(id) {
    const sanitizedId = sqlstring.escape(id);
    const query = `
        SELECT id, room, type, key_liter, key_liter_id, cost, area, floor, ceiling, promotion, images
        FROM rooms
        JOIN (
            SELECT type, cost, area
            FROM rooms
            WHERE id = ${sanitizedId}
        ) AS subquery
        ON rooms.type = subquery.type
        WHERE rooms.id != ${sanitizedId}
        AND organization IN (${sanitizedOrg})
        AND type NOT IN (${typesToExclude})
        AND status = ${statusVacant}
        ORDER BY ABS(rooms.cost - subquery.cost), ABS(rooms.area - subquery.area)
        LIMIT 3
        FORMAT JSON`;

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

async function alterRoomById(id, data) {
    const updates = Object.keys(data).map(key => `${sqlstring.escapeId(key)} = ${sqlstring.escape(data[key])}`).join(', ');
    const query = `ALTER TABLE rooms UPDATE ${updates} WHERE id = ${sqlstring.escape(id)}`;
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

async function addPhotoById(id, fileUrl) {
    const query = `
        ALTER TABLE rooms
        UPDATE images = arrayConcat(images, ['${sqlstring.escape(fileUrl).replace(/'/g, '')}'])
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

async function deletePhotoById(id, fileUrl) {
    const query = `
        ALTER TABLE rooms 
        UPDATE images = arrayFilter(x -> x != '${sqlstring.escape(fileUrl).replace(/'/g, '')}', images)
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

module.exports = {
    getAll,
    getReport,
    getPage,
    getTypes,
    getFloors,
    getRoomsAmounts,
    getIdLiter,
    getRoomById,
    getRecommended,
    getRoomsByTenant,
    getRoomsByParam,
    alterRoomById,
    addPhotoById,
    deletePhotoById,
};
