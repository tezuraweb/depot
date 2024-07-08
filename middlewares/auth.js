const jwt = require("jsonwebtoken");

const config = require('../config/jwtConfig');

const verifyToken = (req, res, next) => {
    if (!req.cookies['secretToken']) {
        return next();
    }

    try {
        const decoded = jwt.verify(req.cookies['secretToken'], config.token);
        req.user = decoded;
    } catch (err) {
        console.log(err.message);
    }

    return next();
};

module.exports = verifyToken;