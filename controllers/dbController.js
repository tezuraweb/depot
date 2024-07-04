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
        const user = await tenantService.alterTenantById(userId, { name });
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

async function getTicketByIdBot(id) {
    try {
        const ticket = await ticketService.getTicketById(id);
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
    getTicketByIdBot,
    insertTicketBot,
};
