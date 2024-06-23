const express = require('express');
const pick = require('lodash/pick');

const router = express.Router();

const manager = {
        id: 1,
        name: "Ладыгин Сергей Александрович",
        text: "В нашем торгово-складском комплекс созданы все условия для эффективного ведения бизнеса! Мы работаем для Вас и всегда строим доверительные отношения с нашими клиентами и партнерами!",
        photo: "/static/img/pics/depo_manager.webp",
    };


router
    .route('/lead')
    .post(async (req, res) => {
        res
            .header('Location', `${req.protocol}://${req.hostname}`)
            .sendStatus(201);
    });

router
    .route('/manager')
    .get(async (req, res) => {
        if (manager) {
            res.json(manager);
        } else {
            res.status(404).json({ error: 'Manager not found' });
        }
    });

module.exports = router;