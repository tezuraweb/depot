const pick = require('lodash/pick');
const tenantService = require('../services/tenantService');
const roomsService = require('../services/roomsService');
const ticketService = require('../services/ticketService');
const docsService = require('../services/docsService');
const residentsService = require('../services/residentsService');
const reportService = require('../services/reportService');

// Tenants

async function getTenantByParam(params) {
    try {
        const user = await tenantService.getTenantByParam(params);
        return user && user.data?.length > 0 ? user.data[0] : null;
    } catch (error) {
        throw error;
    }
}

async function getTenantTgUsername(req, res, next) {
    try {
        const id = req.user.id;
        const user = await tenantService.getTenantByParam({ id });
        const username = user && user.data?.length > 0 ? user.data[0].tg_user : '';
        const tg_id = user && user.data?.length > 0 ? parseInt(user.data[0].tg_id) : 0;
        res.json({ username, tg_id });
    } catch (error) {
        next(error);
    }
}

async function getTenantManagers(organization) {
    try {
        const user = await tenantService.getTgManagers(organization);
        return user && user.data?.length > 0 ? user.data : [];
    } catch (error) {
        throw error;
    }
}

async function setTenantEmail(id, email) {
    try {
        const user = await tenantService.alterTenantById(id, { email });
        return user && user.data?.length > 0 ? user.data[0] : null;
    } catch (error) {
        throw error;
    }
}

async function setTenantPassword(id, password) {
    try {
        const user = await tenantService.alterTenantById(id, { password });
        return user && user.data?.length > 0 ? user.data[0] : null;
    } catch (error) {
        throw error;
    }
}

async function setTenantTgId(id, tg_id) {
    try {
        const user = await tenantService.alterTenantById(id, { tg_id });
        return user && user.data?.length > 0 ? user.data[0] : null;
    } catch (error) {
        throw error;
    }
}

async function setTenantTgUsername(req, res, next) {
    try {
        const id = req.user.id;
        const { tg_user } = pick(req.body, ['tg_user']);
        const user = await tenantService.alterTenantById(id, { tg_user });
        res.json(user);
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

async function getRoomsByTenant(req, res, next) {
    try {
        const rooms = await roomsService.getRoomsByTenant(req.user.id);
        res.json(rooms.data);
    } catch (error) {
        next(error);
    }
}

async function getRoomsSearch(req, res, next) {
    try {
        const data = pick(req.body, ['startIdx', 'endIdx', 'type', 'building', 'areaFrom', 'areaTo', 'priceFrom', 'priceTo', 'priceType', 'priceDesc', 'storey', 'rooms', 'ceilingHeight', 'promotions', 'organization', 'code']);
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
        if (data.code && data.code !== '') dbData.code = data.code;

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

async function getRoomsAmounts(req, res, next) {
    try {
        const rooms = await roomsService.getRoomsAmounts();
        res.json(rooms.data);
    } catch (error) {
        next(error);
    }
}

async function getRoomsFloors(req, res, next) {
    try {
        const rooms = await roomsService.getFloors();
        res.json(rooms.data);
    } catch (error) {
        next(error);
    }
}

async function getRoomsReport(req, res, next) {
    try {
        const base = req.params.base;
        let baseArr = [];
        if (base == 'depot') {
            baseArr.push('ДЕПО АО');
        } else if (base == 'gagarinsky') {
            baseArr.push('ГАГАРИНСКИЙ ПКЦ ООО');
        } else if (base == 'yujnaya') {
            baseArr.push('База Южная ООО');
            baseArr.push('Строительная База "Южная" ООО');
        }
        const rooms = await roomsService.getReport(baseArr);
        res.json(rooms.data);
    } catch (error) {
        next(error);
    }
}

async function getRoomsReportMiddleware(req, res, next) {
    try {
        const base = req.params.base;
        let baseArr = [];
        if (base == 'depot') {
            baseArr.push('ДЕПО АО');
        } else if (base == 'gagarinsky') {
            baseArr.push('ГАГАРИНСКИЙ ПКЦ ООО');
        } else if (base == 'yujnaya') {
            baseArr.push('База Южная ООО');
            baseArr.push('Строительная База "Южная" ООО');
        }
        const rooms = await roomsService.getReport(baseArr);
        req.rooms = rooms.data;
        next();
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

async function getRoomsByBuilding(req, res, next) {
    try {
        const id = req.params.id;
        const rooms = await roomsService.getRoomsByParam({ key_liter_id: id });
        res.json(rooms.data);
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

async function setRoomsPromotions(req, res, next) {
    try {
        const { id, promotion, price } = pick(req.body, ['id', 'promotion', 'price']);
        const rooms = await roomsService.alterRoomById(id, { promotion, promotion_price: price });
        res.json({ success: rooms.success });
    } catch (error) {
        next(error);
    }
}

async function setRoomsPhotoById(id, fileUrl) {
    try {
        const rooms = await roomsService.addPhotoById(id, fileUrl);
        return rooms.success;
    } catch (error) {
        throw error;
    }
}

async function setRoomsDeletePhotoById(id, fileUrl) {
    try {
        const rooms = await roomsService.deletePhotoById(id, fileUrl);
        return rooms.success;
    } catch (error) {
        throw error;
    }
}

// Tickets

async function getTicketByIdBot(id) {
    try {
        const ticket = await ticketService.getTicketById(id);
        return ticket.data;
    } catch (error) {
        throw error;
    }
}

async function getTicketsByUserBot(id, offset, limit) {
    try {
        const ticket = await ticketService.getTicketByUserTg(id, offset, limit);
        return ticket.data;
    } catch (error) {
        throw error;
    }
}

async function getTicketsByStatusBot(status, offset, limit, base) {
    try {

        const ticket = await ticketService.getTicketByStatusTg(status, offset, limit, base);
        return ticket.data;
    } catch (error) {
        throw error;
    }
}

async function insertTicketBot(data) {
    try {
        const ticket = await ticketService.insertTicket(data);
        return ticket.data;
    } catch (error) {
        throw error;
    }
}

async function insertTicketMessageBot(data) {
    try {
        const ticket = await ticketService.addTicketMessage(data);
        return ticket.data;
    } catch (error) {
        throw error;
    }
}

async function updateTicketBot(id, data) {
    try {
        const ticket = await ticketService.updateTicket(id, data);
        return ticket.data;
    } catch (error) {
        throw error;
    }
}

async function getTicketsByTenant(req, res, next) {
    try {
        const ticket = await ticketService.getTicketsByTenant(req.user.id);
        res.json(ticket.data);
    } catch (error) {
        next(error);
    }
}

async function insertTicketFromBackoffice(req, res, next) {
    try {
        const userId = req.user.id;
        const { text } = pick(req.body, ['text']);
        const ticket = await ticketService.insertTicketBackoffice({ userId, text });
        res.json(ticket.data);
    } catch (error) {
        next(error);
    }
}

// Docs

async function getDocsByUser(req, res, next) {
    try {
        const docs = await docsService.getDocsByTenant(req.user.id);
        res.json(docs.data);
    } catch (error) {
        next(error);
    }
}

// Residents

async function getResidents(req, res, next) {
    try {
        const residents = await residentsService.getAll();
        res.json(residents.data);
    } catch (error) {
        next(error);
    }
}

async function alterResidentById(req, res, next) {
    try {
        const data = pick(req.body, ['id', 'title', 'link', 'text']);
        const residents = await residentsService.alterResidentById(data);
        res.json(residents.success);
    } catch (error) {
        next(error);
    }
}

async function insertResident(req, res, next) {
    try {
        const data = pick(req.body, ['title', 'link', 'text']);
        const residents = await residentsService.insertResident(data);
        res.json(residents.success);
    } catch (error) {
        next(error);
    }
}

async function deleteResident(req, res, next) {
    try {
        const id = req.params.id;
        const result = await residentsService.deleteResident(id);
        res.json(result.success);
    } catch (error) {
        next(error);
    }
}

async function setResidentsPhotoById(id, fileUrl) {
    try {
        const residents = await residentsService.updatePhotoById(id, fileUrl);
        return residents.previousLogo;
    } catch (error) {
        throw error;
    }
}

// Report

async function getReport(req, res, next) {
    try {
        const report = await reportService.getReport();
        res.json(report.data);
    } catch (error) {
        next(error);
    }
}

async function getReportMiddleware(req, res, next) {
    try {
        const base = req.params.base;
        let baseArr = [];
        if (base == 'depot') {
            baseArr.push('ДЕПО АО');
        } else if (base == 'gagarinsky') {
            baseArr.push('ГАГАРИНСКИЙ ПКЦ ООО');
        } else if (base == 'yujnaya') {
            baseArr.push('База Южная ООО');
            baseArr.push('Строительная База "Южная" ООО');
        }
        const report = await reportService.getReport(baseArr);
        req.report = report.data;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getTenantByParam,
    setTenantEmail,
    getTenantTgUsername,
    getTenantManagers,
    setTenantPassword,
    setTenantTgUsername,
    setTenantTgId,
    getAllRooms,
    getRoomsSearch,
    getRoomsTypes,
    getRoomsLiters,
    getRoomsAmounts,
    getRoomsFloors,
    getRoomsReport,
    getRoomsReportMiddleware,
    getRoomsById,
    getRoomsByBuilding,
    getRoomsRecommended,
    getRoomsByTenant,
    setRoomsPromotions,
    setRoomsPhotoById,
    setRoomsDeletePhotoById,
    getTicketByIdBot,
    getTicketsByTenant,
    insertTicketBot,
    insertTicketMessageBot,
    getTicketsByUserBot,
    getTicketsByStatusBot,
    updateTicketBot,
    insertTicketFromBackoffice,
    getDocsByUser,
    getResidents,
    alterResidentById,
    insertResident,
    deleteResident,
    setResidentsPhotoById,
    getReport,
    getReportMiddleware,
};
