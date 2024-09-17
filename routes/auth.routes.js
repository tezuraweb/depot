const express = require('express');
const jwt = require("jsonwebtoken");
const auth = require('../middlewares/auth');
const jwtConfig = require('../config/jwtConfig');
const appConfig = require('../config/appConfig');
const dbController = require('../controllers/dbController');

const router = express.Router();

router
    .route('/login')
    .get(auth, (req, res) => {
        res.render('nodes/login', { activeBase: appConfig.base });
    });

router
    .route('/signup')
    .get(auth, (req, res) => {
        res.render('nodes/signup', { activeBase: appConfig.base });
    });

router
    .route('/password-reset')
    .get(auth, (req, res) => {
        res.render('nodes/signup', { activeBase: appConfig.base });
    });

router
    .route('/verify/:token')
    .get(auth, (req, res) => {
        try {
            const { token } = req.params;

            jwt.verify(token, jwtConfig.emailToken, async (err, decoded) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send("Email verification failed, possibly the link is invalid or expired");
                }
                const user = await dbController.setTenantEmail(decoded.id, decoded.email);
                res.render('nodes/reset', { activeBase: appConfig.base });
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Failed to login' });
        }
    });

router
    .route('/reset/:token')
    .get(auth, (req, res) => {
        try {
            const { token } = req.params;

            jwt.verify(token, jwtConfig.emailToken, async (err, decoded) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send("Email verification failed, possibly the link is invalid or expired");
                }

                res.render('nodes/reset', { activeBase: appConfig.base });
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Failed to login' });
        }
    });

router
    .route('/logout')
    .get(async (req, res) => {
        try {
            return res.clearCookie("secretToken").redirect('/');
        } catch (err) {
            console.log(err);
        }
    });

module.exports = router;