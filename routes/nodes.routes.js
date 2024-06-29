const express = require('express');

const Premises = require('../models/Premises');

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
        res.render('nodes/profile', { user: { name: 'Иван Федорович Крузенштерн' }, page: 'profile' });
    });

router
    .route('/documents')
    .get((req, res) => {
        res.render('nodes/docs', { user: { name: 'Иван Федорович Крузенштерн' }, page: 'docs' });
    });

router
    .route('/requests')
    .get((req, res) => {
        res.render('nodes/requests', { user: { name: 'Иван Федорович Крузенштерн' }, page: 'requests' });
    });

router
    .route('/test')
    .get(async (req, res) => {
        // try {
        //     res.render('nodes/test');
        // } catch (error) {
        //     res.status(500).json({ error: 'Internal Server Error' });
        // }
        try {
            const data = await Premises.getPremises();
            console.log(data);
            if (data) {
                res.json(data);
            } else {
                res.status(404).json({ error: 'lol' });
            }
        } catch (error) {
            console.log(error);
            res.status(404).json({ error: error });
        }
    });

module.exports = router;