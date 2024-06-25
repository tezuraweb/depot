const express = require('express');
const pick = require('lodash/pick');

const router = express.Router();

const manager = {
        id: 1,
        name: "Ладыгин Сергей Александрович",
        text: "В нашем торгово-складском комплекс созданы все условия для эффективного ведения бизнеса! Мы работаем для Вас и всегда строим доверительные отношения с нашими клиентами и партнерами!",
        photo: "/img/pics/depo_manager.webp",
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
        location: "Элитный квартал",
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
        location: "Элитный квартал",
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
        location: "Элитный квартал",
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
        location: "Элитный квартал",
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
        location: "Зеленая зона",
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
        location: "Возвышенность",
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
        location: "Технопарк",
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
        location: "Спальный район",
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
        location: "Зеленая зона",
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
        location: "Возвышенность",
        article: "D012",
        area: 1000,
        floor: 0,
        price: "100000 руб.",
        images: ['/img/pics/ft.png'],
        type: "land"
    },
];

const tenants = [
    {
        id: 1,
        logo: "/img/pics/tenant1.webp",
        title: "Сеть столовых Борщ",
        link: "https://borshch18.ru",
        text: "Сеть столовых «Борщ» предлагает широкий выбор полноценных завтраков и обедов с разнообразным меню на каждый день. Компания имеет собственное производство с соблюдением всех стандартов и требований. Мы готовим только из свежих и качественных продуктов. Привезём обеды на дом, в офис, организуем корпоративное питание. Мы экономим ваше время, чтобы Вы провели его с близкими."
    },
    {
        id: 2,
        logo: "/img/pics/tenant2.webp",
        title: "УралЭнерго",
        link: "https://www.u-energo.ru/",
        text: "«Уралэнерго» - это комплексные решения в сфере электротехники для ваших задач - от технической консультации и разработки проекта до поставки и монтажа электротехнической, кабельно-проводниковой и светотехнической продукции. Опыт работы на рынке – 20 лет. В портфеле более 200 российских и зарубежных производителей, на сегодня «Уралэнерго» предлагает порядка миллиона наименований изделий. Ассортимент позволяет нам предложить сразу несколько решений по каждому электротехническому направлению, будь то высоковольтное оборудование или светотехника. "
    },
    {
        id: 3,
        logo: "/img/pics/tenant3.webp",
        title: "Регоператор УР Спецавтохозяйство",
        link: "https://xn--80afebbua4aociifcc1afoc.xn--p1ai/",
        text: "ООО «Спецавтохозяйство» — официальный региональный оператор по обращению с ТКО в Удмуртии. Мы – это опыт 90 лет работы, современная техника, сильная команда и миссия сделать мир чище. Создаём инфраструктуру – чтобы построить новый цивилизованный подход к мусору. Внедряем раздельный сбор отходов - чтобы подарить им вторую жизнь. Строим «Экодома» – чтобы в каждом доме было место экологичности. Ликвидируем несанкционированные свалки - чтобы очистить леса и поля. Экопросвещаем - чтобы было #ЧистоПоУдмуртски."
    },
    {
        id: 4,
        logo: "/img/pics/tenant4.webp",
        title: "Русское стрелковое оружие",
        link: "https://business.kalashnikov.market/",
        text: "Компания «Русское Стрелковое Оружие» входит в группу компаний «Калашников» и является официальным дистрибьютором гражданской продукции АО «Концерн «Калашников» и АО «Ижевский Механический Завод»"
    },
];

const rented = [
    {
        id: 1,
        promotion: true,
        location: "Центр города",
        article: "A123",
        area: 100,
        floor: 3,
        price: "50000 руб.",
        images: ['/img/pics/ft.png', '/img/pics/ft.png', '/img/pics/ft.png'],
        type: "office",
        rentedUntil: '08.10.2027',
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
        type: "industrial",
        rentedUntil: '08.09.2027',
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
        type: "commercial",
        rentedUntil: '08.09.2025',
    }
];

const docs = [
    {
        id: 1,
        type: 'contract',
        title: 'Договор аренды',
        link: '/test/unique_BB.pdf',
        signed: false,
    },
    {
        id: 2,
        type: 'act',
        title: 'Акт 1',
        link: '/test/unique_BB.pdf',
        signed: false,
    },
    {
        id: 3,
        type: 'klyauza',
        title: 'Справка 1',
        link: '/test/unique_BB.pdf',
        signed: false,
    }
]

const requests = [
    {
      id: 1,
      date: '2024-05-03T10:00:00Z',
      status: 'closed'
    },
    {
      id: 2,
      date: '2024-06-10T14:30:00Z',
      status: 'pending'
    },
    {
      id: 3,
      date: '2024-07-15T09:00:00Z',
      status: 'active'
    }
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
    .route('/partners/count')
    .get(async (req, res) => {
        if (cards) {
            res.json({total: cards.length});
        } else {
            res.status(404).json({ error: 'Premises not found' });
        }
    });

router
    .route('/partners')
    .post(async (req, res) => {
        const data = pick(req.body, 'page');
        const page = parseInt(data.page);

        if (cards && !isNaN(page)) {
            if ((page - 1) * 3 < cards.length) {
                res.json(cards.slice((page - 1) * 3, page * 3));
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
    .route('/rented')
    .get(async (req, res) => {
        if (cards) {
            res.json(rented);
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

router
    .route('/tenants')
    .get(async (req, res) => {
        if (tenants) {
            res.json(tenants);
        } else {
            res.status(404).json({ error: 'Tenants not found' });
        }
    });

router
    .route('/docs')
    .get(async (req, res) => {
        if (docs) {
            res.json(docs);
        } else {
            res.status(404).json({ error: 'Documents not found' });
        }
    });

router
    .route('/requests')
    .get(async (req, res) => {
        if (requests) {
            res.json(requests);
        } else {
            res.status(404).json({ error: 'Requests not found' });
        }
    });

module.exports = router;