const express = require('express');
const auth = require('../middlewares/auth');
const appConfig = require('../config/appConfig');

const router = express.Router();

router
    .route('/')
    .get(auth, (req, res) => {
        res.render('nodes/index', { activePage: 'main', activeBase: appConfig.base });
    });

router
    .route('/search')
    .get(auth, (req, res) => {
        res.render('nodes/search', { activeBase: appConfig.base });
    });

router
    .route('/premises/:id')
    .get(auth, (req, res) => {
        res.render('nodes/premises', { activeBase: appConfig.base });
    });

router
    .route('/about')
    .get(auth, (req, res) => {
        res.render('nodes/company', { activeBase: appConfig.base });
    });

router
    .route('/lightindustrial')
    .get(auth, (req, res) => {
        res.render('nodes/lightindustrial', { activeBase: appConfig.base });
    });

module.exports = router;