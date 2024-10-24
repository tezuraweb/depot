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
// const statusVacant = sqlstring.escape('Свободен');

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
        FORMAT JSON`;
    // AND status = ${statusVacant}
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
        FORMAT JSON`;
    // AND status = ${statusVacant}
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
            rooms.liter, 
            rooms.id_liter, 
            rooms.cost, 
            rooms.area, 
            rooms.floor, 
            rooms.ceiling, 
            rooms.promotion,
            rooms.date_d,
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

// sane
async function getPage(data) {
    const conditions = [];

    if (data.id_liter) conditions.push(`key_liter_id = ${sqlstring.escape(data.id_liter)}`);
    if (data.floor) conditions.push(`floor = ${sqlstring.escape(data.floor)}`);
    if (data.ceiling) conditions.push(`ceiling = ${sqlstring.escape(data.ceiling)}`);
    if (data.promotion) conditions.push(`promotion = ${sqlstring.escape(data.promotion)}`);
    if (data.code) conditions.push(`kode_text LIKE '%${sqlstring.escape(data.code).replace(/^'|'$/g, "")}%'`);

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

    // conditions.push(`status = ${statusVacant}`);

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `
        SELECT id, room, type, liter, id_liter, key_liter, kode_text AS code, cost, area, floor, ceiling, promotion, promotion_price, images
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

// insane
async function getPageGroupComplex(data) {
    const conditions = [];

    if (data.id_liter) conditions.push(`key_liter_id = ${sqlstring.escape(data.id_liter)}`);
    if (data.floor) conditions.push(`floor = ${sqlstring.escape(data.floor)}`);
    if (data.ceiling) conditions.push(`ceiling = ${sqlstring.escape(data.ceiling)}`);

    if (data.type) {
        conditions.push(`type = ${sqlstring.escape(data.type)}`);
    } else {
        conditions.push(`type NOT IN ${typesToExclude}`);
    }

    if (data.organization !== undefined && Array.isArray(data.organization) && data.organization.length > 0) {
        conditions.push(`organization IN (${data.organization.map(item => sqlstring.escape(item)).join(', ')})`);
    } else {
        conditions.push(`organization IN (${sanitizedOrg})`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `
        SELECT id, room, type, liter, id_liter, key_liter, kode_text AS code, cost, area, floor, ceiling, promotion, promotion_price, images, complex_id, organization
        FROM rooms 
        ${whereClause}
        ORDER BY promotion DESC, cost ${data.priceDesc ? 'DESC' : ''}, id
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

        const renponseData = response?.data?.data;
        result = [];
        complexes = {};
        renponseData.forEach((item) => {
            if (!item.complex_id || item.complex_id === 0) {
                item.amount = 1;
                item.roomCodes = [item.code];
                result.push(item);
            } else {
                if (!complexes[item.complex_id]) {
                    item.amount = 1;
                    item.roomCodes = [item.code];
                    complexes[item.complex_id] = item;
                } else {
                    complexes[item.complex_id].area += item.area;
                    complexes[item.complex_id].promotion = complexes[item.complex_id].promotion || item.promotion;
                    complexes[item.complex_id].images = [...complexes[item.complex_id].images, ...item.images];
                    complexes[item.complex_id].amount += 1;
                    complexes[item.complex_id].roomCodes.push(item.code);
                }
            }
        });

        Object.keys(complexes).forEach((key) => {
            result.push(complexes[key]);
        });

        const resultFiltered = result.filter((item) => {
            let match = true;

            if (data.promotion) {
                match = match && item.promotion;
            }

            if (data.areaFrom !== undefined && data.areaTo !== undefined) {
                match = match && (item.area >= data.areaFrom) && (item.area <= data.areaTo);
            } else if (data.areaFrom !== undefined) {
                match = match && (item.area >= data.areaFrom);
            } else if (data.areaTo !== undefined) {
                match = match && (item.area <= data.areaTo);
            }

            if (data.priceType === 'total') {
                if (data.priceFrom !== undefined && data.priceTo !== undefined) {
                    match = match && (item.area * item.cost >= data.priceFrom) && (item.area * item.cost <= data.priceTo);
                } else if (data.priceFrom !== undefined) {
                    match = match && (item.area * item.cost >= data.priceFrom);
                } else if (data.priceTo !== undefined) {
                    match = match && (item.area * item.cost <= data.priceTo);
                }
            } else {
                if (data.priceFrom !== undefined && data.priceTo !== undefined) {
                    match = match && (item.cost >= data.priceFrom) && (item.cost <= data.priceTo);
                } else if (data.priceFrom !== undefined) {
                    match = match && (item.cost >= data.priceFrom);
                } else if (data.priceTo !== undefined) {
                    match = match && (item.cost <= data.priceTo);
                }
            }

            return match;
        });

        const resultLength = resultFiltered.length;
        const sortedResult = resultFiltered.sort((a, b) => {
            if (a.status !== b.status) {
                if (a.status === 'Свободен') return -1;
                if (b.status === 'Свободен') return 1;
            } else {
                if (a.id < b.id) return -1;
            }
            return 1;
        });
        const slicedResult = sortedResult.slice(data.offset, data.limit);

        return { data: slicedResult, rows_before_limit_at_least: resultLength };
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
        SELECT id, room, type, liter, id_liter, key_liter, key_liter_id, cost, area, floor, ceiling, text, promotion, complex_id, kode_text, images
        FROM rooms
        WHERE id = ${sanitizedId}
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
        SELECT id, kode_text AS code, complex_id AS complex
        FROM rooms
        WHERE ${conditions} AND kode_text != '' AND organization IN (${sanitizedOrg})
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
        SELECT id, room, type, liter, id_liter, cost, area, floor, ceiling, promotion, images
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
        ORDER BY ABS(rooms.cost - subquery.cost), ABS(rooms.area - subquery.area)
        LIMIT 3
        FORMAT JSON`;
    // AND status = ${statusVacant}
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
    getIdLiter,
    getRoomById,
    getRecommended,
    getRoomsByTenant,
    getRoomsByParam,
    alterRoomById,
    addPhotoById,
    deletePhotoById,
    getPageGroupComplex,
};
