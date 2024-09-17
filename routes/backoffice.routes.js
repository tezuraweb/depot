const express = require('express');
const auth = require('../middlewares/auth');
const appConfig = require('../config/appConfig');

const router = express.Router();

router
    .route('/profile')
    .get(auth, (req, res) => {
        if (req.user.status && req.user.status === 'admin') {
            return res.redirect('/backoffice/editor');
        }
        res.render('nodes/profile', { user: req.user, page: 'profile', activeBase: appConfig.base });
    });

router
    .route('/documents')
    .get(auth, (req, res) => {
        if (req.user.status && req.user.status === 'admin') {
            return res.redirect('/backoffice/editor');
        }
        res.render('nodes/docs', { user: req.user, page: 'docs', activeBase: appConfig.base });
    });

router
    .route('/requests')
    .get(auth, (req, res) => {
        if (req.user.status && req.user.status === 'admin') {
            return res.redirect('/backoffice/editor');
        }
        res.render('nodes/requests', { user: req.user, page: 'requests', activeBase: appConfig.base });
    });

router
    .route('/premises')
    .get(auth, (req, res) => {
        if (req.user.status && req.user.status === 'tenant') {
            return res.redirect('/backoffice/profile');
        }
        res.render('nodes/premises-editor', { user: req.user, page: 'premises', activeBase: appConfig.base });
    });

router
    .route('/editor')
    .get(auth, (req, res) => {
        if (req.user.status && req.user.status === 'tenant') {
            return res.redirect('/backoffice/profile');
        }
        res.render('nodes/editor', { user: req.user, page: 'editor', activeBase: appConfig.base });
    });

// router
//     .route('/feedback')
//     .get(auth, (req, res) => {
//         if (req.user.status && req.user.status === 'tenant') {
//             return res.redirect('/backoffice/profile');
//         }
//         res.render('nodes/feedback', { user: req.user, page: 'feedback', activeBase: appConfig.base });
//     });

router
    .route('/report')
    .get(auth, (req, res) => {
        if (req.user.status && req.user.status === 'tenant') {
            return res.redirect('/backoffice/profile');
        }
        res.render('nodes/report', { user: req.user, page: 'report', activeBase: appConfig.base });
    });

module.exports = router;