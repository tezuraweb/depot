const pick = require('lodash/pick');
const tenantService = require('../services/tenantService');
const roomsService = require('../services/roomsService');
const ticketService = require('../services/ticketService');

// Tenants

async function getTenantById(req, res, next) {
    try {
        const userId = req.params.id;
        const user = await tenantService.getTenantById(userId);
        res.json(user.data);
    } catch (error) {
        next(error);
    }
}

async function alterTenantById(req, res, next) {
    try {
        const userId = req.params.id;
        const name = req.query.name;
        const status = req.query.status;
        const user = await tenantService.alterTenantById(userId, { name, status });
        res.json(user.data);
    } catch (error) {
        next(error);
    }
}

// Rooms

async function getAllRooms(req, res, next) {
    try {
        const rooms = await roomsService.getAll();
        res.json(rooms.data);
    } catch (error) {
        next(error);
    }
}

async function getRoomsSearch(req, res, next) {
    try {
        const data = pick(req.body, ['startIdx', 'endIdx', 'type', 'building', 'areaFrom', 'areaTo', 'priceFrom', 'priceTo', 'priceType', 'priceDesc', 'storey', 'rooms', 'ceilingHeight', 'promotions']);
        const dbData = {};

        if (data.startIdx !== undefined && data.startIdx !== null) dbData.offset = data.startIdx || 0;
        if (data.endIdx !== undefined && data.endIdx !== null) dbData.limit = (data.endIdx - dbData.offset) || 6;

        if (data.type && data.type !== '') dbData.type = data.type;
        if (data.building && data.building !== '') dbData.id_liter = data.building;
        if (data.areaFrom && data.areaFrom !== '') dbData.areaFrom = parseFloat(data.areaFrom);
        if (data.areaTo && data.areaTo !== '') dbData.areaTo = parseFloat(data.areaTo);
        if (data.priceFrom && data.priceFrom !== '') dbData.priceFrom = parseFloat(data.priceFrom);
        if (data.priceTo && data.priceTo !== '') dbData.priceTo = parseFloat(data.priceTo);
        if (data.priceType && data.priceType !== '') dbData.priceType = data.priceType;
        if (data.priceDesc !== undefined) dbData.priceDesc = data.priceDesc;
        if (data.storey && data.storey !== '') dbData.floor = parseFloat(data.storey);
        if (data.rooms && data.rooms !== '') dbData.roomsAmount = data.rooms;
        if (data.ceilingHeight && data.ceilingHeight !== '') dbData.ceiling = parseFloat(data.ceilingHeight);
        if (data.promotions !== undefined) dbData.promotion = data.promotions;
        if (data.organization && data.organization !== '') dbData.organization = data.organization;

        const rooms = await roomsService.getPage(dbData);
        res.json({ rows: rooms.data, total: rooms.rows_before_limit_at_least });
    } catch (error) {
        next(error);
    }
}

async function getRoomsTypes(req, res, next) {
    try {
        const rooms = await roomsService.getTypes();
        res.json(rooms.data);
    } catch (error) {
        next(error);
    }
}

async function getRoomsLiters(req, res, next) {
    try {
        const rooms = await roomsService.getIdLiter();
        res.json(rooms.data);
    } catch (error) {
        next(error);
    }
}

async function getRoomsReport(req, res, next) {
    try {
        const rooms = await roomsService.getReport();
        res.json(rooms.data);
    } catch (error) {
        next(error);
    }
}

async function getRoomsById(req, res, next) {
    try {
        const id = req.params.id;
        const rooms = await roomsService.getRoomById(id);
        res.json(rooms.data[0]);
    } catch (error) {
        next(error);
    }
}

async function getRoomsRecommended(req, res, next) {
    try {
        const id = req.params.id;
        const rooms = await roomsService.getRecommended(id);
        res.json(rooms.data);
    } catch (error) {
        next(error);
    }
}

// Bot

async function getUserBot(id) {
    try {
        const user = await tenantService.getTenantByTgId(id);
        return user && user.data?.length > 0 ? user.data[0] : null;
    } catch (error) {
        console.log(error);
    }
}

async function getTicketByIdBot(id) {
    try {
        const ticket = await ticketService.getTicketById(id);
        return ticket.data;
    } catch (error) {
        console.log(error);
    }
}

async function getTicketByNumberBot(number) {
    try {
        const ticket = await ticketService.getTicketByNumber(number);
        return ticket.data;
    } catch (error) {
        console.log(error);
    }
}

async function getTicketsByUserBot(id, offset, limit) {
    try {
        const ticket = await ticketService.getTicketByUserTg(id, offset, limit);
        return ticket.data;
    } catch (error) {
        console.log(error);
    }
}

async function getTicketsByStatusBot(status, offset, limit) {
    try {
        const ticket = await ticketService.getTicketByStatusTg(status, offset, limit);
        return ticket.data;
    } catch (error) {
        console.log(error);
    }
}

async function insertTicketBot(data) {
    try {
        const ticket = await ticketService.insertTicket(data);
        return ticket.data;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getTenantById,
    alterTenantById,
    getAllRooms,
    getRoomsSearch,
    getRoomsTypes,
    getRoomsLiters,
    getRoomsReport,
    getRoomsById,
    getRoomsRecommended,
    getUserBot,
    getTicketByIdBot,
    getTicketByNumberBot,
    insertTicketBot,
    getTicketsByUserBot,
    getTicketsByStatusBot,
};
