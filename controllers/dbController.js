const dbService = require('../services/tenantService');

async function getVersion(req, res, next) {
    try {
        const version = await dbService.getVersion();
        res.json(version.data);
    } catch (error) {
        next(error);
    }
}

async function getTenantById(req, res, next) {
    try {
        const userId = req.params.id;
        const user = await dbService.getTenantById(userId);
        res.json(user.data);
    } catch (error) {
        next(error);
    }
}

async function alterTenantById(req, res, next) {
    try {
        const userId = req.params.id;
        const name = req.query.name;
        const user = await dbService.alterTenantById(userId, { name });
        res.json(user.data);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getTenantById,
    alterTenantById,
};
