const express = require('express');

const router = express.Router();

router
    .route('/')
    .get((req, res) => {
        res.render('nodes/index', { activePage: 'main' });
    });

router
    .route('/search')
    .get((req, res) => {
        const {
            type = '',
            area = '',
            priceFrom = '',
            priceTo = '',
            promotions = false,
            priceDesc = false,
            page = 1
        } = req.query;

        const numericPriceFrom = priceFrom ? parseFloat(priceFrom) : undefined;
        const numericPriceTo = priceTo ? parseFloat(priceTo) : undefined;
        const booleanPromotions = promotions === 'true';
        const booleanPriceDesc = priceDesc === 'true';
        const pageNumber = parseInt(page, 10);

        res.render('nodes/search');
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

router
    .route('/about')
    .get((req, res) => {
        res.render('nodes/company');
    });


module.exports = router;