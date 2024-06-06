const express = require('express');

const router = express.Router();

router
    .route('/')
    .get((req, res) => {
        res.render('nodes/index', { activePage: 'main' });
    });

router
    .route('/en')
    .get((req, res) => {
        res.render('nodes/index', { language: 'en' });
    });

router
    .route('/ru')
    .get((req, res) => {
        res.render('nodes/index', { language: 'ru' });
    });


module.exports = router;