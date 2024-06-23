const express = require('express');
const pick = require('lodash/pick');

const router = express.Router();

const manager = {
        id: 1,
        name: "Ладыгин Сергей Александрович",
        text: "В нашем торгово-складском комплекс созданы все условия для эффективного ведения бизнеса! Мы работаем для Вас и всегда строим доверительные отношения с нашими клиентами и партнерами!",
        photo: "/static/img/pics/depo_manager.webp",
    };

const premises = {
    '1': {
        id: '1',
        liter: 'Б',
        building_id: 'depot-building-1',
        type: 'офис',
        name: 'Пр244',
        area: '9.7',
        floor: 2,
        ceiling: '5',
        cost: '273',
        images: ['/img/pics/ft.png', '/img/pics/ft.png', '/img/pics/ft.png'],
        text: 'Офисные площади имеют свежий ремонт, пластиковые окна. Некоторые офисы оснащены мебелью.'
    },
    '2': {
        id: '2',
        liter: 'А',
        building_id: 'depot-building-1',
        type: 'офис',
        name: 'Пр101',
        area: '15',
        floor: 3,
        ceiling: '4',
        cost: '300',
        images: ['/img/pics/ft.png', '/img/pics/ft.png', '/img/pics/ft.png'],
        text: 'Офисные площади имеют свежий ремонт, пластиковые окна. Некоторые офисы оснащены мебелью.'
    },
    '3': {
        id: '3',
        liter: 'В',
        type: 'офис',
        building_id: 'depot-building-1',
        name: 'Пр202',
        area: '20',
        floor: 1,
        ceiling: '3.5',
        cost: '250',
        images: ['/img/pics/ft.png', '/img/pics/ft.png', '/img/pics/ft.png'],
    },
    '4': {
        id: '4',
        liter: 'Г',
        building_id: 'depot-building-2',
        type: 'офис',
        name: 'Пр303',
        area: '12',
        floor: 4,
        ceiling: '4.5',
        cost: '280',
    },
    '5': {
        id: '5',
        liter: 'Д',
        type: 'офис',
        name: 'Пр404',
        area: '25',
        floor: 5,
        ceiling: '5.5',
        cost: '320',
    }
};

const recs = [
    [{
        id: 6,
        promotion: false,
        location: "Индустриальный парк",
        article: "F678",
        area: 800,
        floor: 1,
        price: "200000 руб.",
        images: ['/img/pics/ft.png'],
        type: "industrial"
    },
    {
        id: 7,
        promotion: true,
        location: "Жопа",
        article: "A123",
        area: 100,
        floor: 3,
        price: "50000 руб.",
        images: ['/img/pics/ft.png', '/img/pics/ft.png', '/img/pics/ft.png'],
        type: "office"
    },
    {
        id: 8,
        promotion: false,
        location: "Жопа",
        article: "B456",
        area: 500,
        floor: 1,
        price: "150000 руб.",
        images: ['/img/pics/ft.png'],
        type: "industrial"
    }],
];

const cards = [
    {
        id: 1,
        promotion: true,
        location: "Центр города",
        article: "A123",
        area: 100,
        floor: 3,
        price: "50000 руб.",
        images: ['/img/pics/ft.png', '/img/pics/ft.png', '/img/pics/ft.png'],
        type: "office"
    },
    {
        id: 2,
        promotion: false,
        location: "Промышленная зона",
        article: "B456",
        area: 500,
        floor: 1,
        price: "150000 руб.",
        images: ['/img/pics/ft.png'],
        type: "industrial"
    },
    {
        id: 3,
        promotion: true,
        location: "Торговый центр",
        article: "C789",
        area: 200,
        floor: 2,
        price: "80000 руб.",
        images: ['/img/pics/ft.png'],
        type: "commercial"
    },
    {
        id: 4,
        promotion: false,
        location: "Пригород",
        article: "D012",
        area: 1000,
        floor: 0,
        price: "100000 руб.",
        images: ['/img/pics/ft.png'],
        type: "land"
    },
    {
        id: 5,
        promotion: true,
        location: "Центр города",
        article: "E345",
        area: 120,
        floor: 4,
        price: "60000 руб.",
        images: ['/img/pics/ft.png'],
        type: "office"
    },
    {
        id: 6,
        promotion: false,
        location: "Индустриальный парк",
        article: "F678",
        area: 800,
        floor: 1,
        price: "200000 руб.",
        images: ['/img/pics/ft.png'],
        type: "industrial"
    },
    {
        id: 7,
        promotion: true,
        location: "Жопа",
        article: "A123",
        area: 100,
        floor: 3,
        price: "50000 руб.",
        images: ['/img/pics/ft.png', '/img/pics/ft.png', '/img/pics/ft.png'],
        type: "office"
    },
    {
        id: 8,
        promotion: false,
        location: "Жопа",
        article: "B456",
        area: 500,
        floor: 1,
        price: "150000 руб.",
        images: ['/img/pics/ft.png'],
        type: "industrial"
    },
    {
        id: 9,
        promotion: true,
        location: "Пизда",
        article: "C789",
        area: 200,
        floor: 2,
        price: "80000 руб.",
        images: ['/img/pics/ft.png'],
        type: "commercial"
    },
    {
        id: 10,
        promotion: false,
        location: "Дно",
        article: "D012",
        area: 1000,
        floor: 0,
        price: "100000 руб.",
        images: ['/img/pics/ft.png'],
        type: "land"
    },
    {
        id: 11,
        promotion: true,
        location: "Дыра",
        article: "E345",
        area: 120,
        floor: 4,
        price: "60000 руб.",
        images: ['/img/pics/ft.png'],
        type: "office"
    },
    {
        id: 12,
        promotion: false,
        location: "Хрущобы",
        article: "F678",
        area: 800,
        floor: 1,
        price: "200000 руб.",
        images: ['/img/pics/ft.png'],
        type: "industrial"
    },
    {
        id: 9,
        promotion: true,
        location: "Пизда",
        article: "C789",
        area: 200,
        floor: 2,
        price: "80000 руб.",
        images: ['/img/pics/ft.png'],
        type: "commercial"
    },
    {
        id: 10,
        promotion: false,
        location: "Дно",
        article: "D012",
        area: 1000,
        floor: 0,
        price: "100000 руб.",
        images: ['/img/pics/ft.png'],
        type: "land"
    },
];

router
    .route('/search/count')
    .get(async (req, res) => {
        if (cards) {
            res.json({total: cards.length});
        } else {
            res.status(404).json({ error: 'Premises not found' });
        }
    });

router
    .route('/search')
    .post(async (req, res) => {
        const data = pick(req.body, 'page', 'type', 'building', 'areaFrom', 'areaTo', 'priceFrom', 'priceTo', 'storey', 'rooms', 'ceilingHeight', 'promotions');
        const page = parseInt(data.page);

        if (cards && !isNaN(page)) {
            if ((page - 1) * 6 < cards.length) {
                res.json(cards.slice((page - 1) * 6, page * 6));
            } else {
                res.json([]);
            }
        } else {
            res.status(404).json({ error: 'Premises not found' });
        }
    });

router
    .route('/premises/:id')
    .get(async (req, res) => {
        const id = req.params.id;
        const premisesData = premises[id];
        if (premisesData) {
            res.json(premisesData);
        } else {
            res.status(404).json({ error: 'Premises not found' });
        }
    });

router
    .route('/recommendations/:id')
    .get(async (req, res) => {
        const id = req.params.id;
        const premisesData = recs[id-1];
        if (premisesData) {
            res.json(premisesData);
        } else {
            res.status(404).json({ error: 'Premises not found' });
        }
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