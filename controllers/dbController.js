const tenantService = require('../services/tenantService');
const roomsService = require('../services/roomsService');
const ticketService = require('../services/ticketService');

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

async function getAllRooms(req, res, next) {
    try {
        const rooms = await roomsService.getAll();
        res.json(rooms.data);
    } catch (error) {
        next(error);
    }
}

async function getReportRooms(req, res, next) {
    try {
        const rooms = await roomsService.getReport();
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
    getReportRooms,
    getUserBot,
    getTicketByIdBot,
    getTicketByNumberBot,
    insertTicketBot,
    getTicketsByUserBot,
    getTicketsByStatusBot,
};
