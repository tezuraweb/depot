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
    .route('/premises/:id')
    .get((req, res) => {
        const id = req.params.id;
        res.render('nodes/premises', { id });
    });

router
    .route('/about')
    .get((req, res) => {
        res.render('nodes/company');
    });

router
    .route('/lightindustrial')
    .get((req, res) => {
        res.render('nodes/lightindustrial');
    });

router
    .route('/login')
    .get((req, res) => {
        res.render('nodes/login', { user: null });
    });
    
router
    .route('/profile')
    .get((req, res) => {
        res.render('nodes/profile', { user: { name: 'Иван Федорович Крузенштерн'}, page: 'profile' });
    });

router
    .route('/documents')
    .get((req, res) => {
        res.render('nodes/docs', { user: { name: 'Иван Федорович Крузенштерн'}, page: 'docs' });
    });

router
    .route('/requests')
    .get((req, res) => {
        res.render('nodes/requests', { user: { name: 'Иван Федорович Крузенштерн'}, page: 'requests' });
    });

router
    .route('/editor')
    .get((req, res) => {
        res.render('nodes/editor', { user: { name: 'Иван Федорович Крузенштерн', admin: true }, page: 'editor' });
    });

router
    .route('/feedback')
    .get((req, res) => {
        res.render('nodes/feedback', { user: { name: 'Иван Федорович Крузенштерн', admin: true }, page: 'feedback' });
    });

router
    .route('/report')
    .get((req, res) => {
        res.render('nodes/report', { user: { name: 'Иван Федорович Крузенштерн', admin: true }, page: 'report' });
    });

module.exports = router;