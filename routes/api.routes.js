const express = require('express');
const pick = require('lodash/pick');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const sharp = require('sharp');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const auth = require('../middlewares/auth');
const appConfig = require('../config/appConfig');
const jwtConfig = require('../config/jwtConfig');
const bitrixConfig = require('../config/bitrixConfig');
const dbController = require('../controllers/dbController');
const { sendVerificationEmail, generateToken } = require('../services/emailService');

const router = express.Router();

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    cb(null, file.mimetype.match(/^image\//));
};

const upload = multer({
    storage: storage,
    fileFilter,
    limits: {
        fileSize: 10485760,
    },
}).single('file');

const depotManager = {
    id: 1,
    name: "Ладыгин Сергей Александрович",
    text: "В нашем ТСК созданы все условия для эффективного ведения бизнеса! Мы работаем для Вас и всегда строим доверительные отношения с нашими клиентами и партнерами! 24/7 я на связи по номеру +79128566785. Обращайтесь, помогу решить любые вопросы!",
    photo: "/img/pics/depo_manager.webp",
};

const gagarinskyManager = {
    id: 1,
    name: "Пивоваров Денис Олегович",
    text: "Мы знаем, как важно создавать условия для комфортной работы наших клиентов и партнеров. И работаем над этим ежедневно. Я всегда на связи по номеру +79124492233, открыт для предложений и готов помочь.",
    photo: "/img/pics/gagarinskii_manager.webp",
};

const yujnayaManager = {
    id: 1,
    name: "Пичугин Федор Юрьевич",
    text: "Выгодные условия для ведения бизнеса вы всегда сможете найти на Базе “Южной”! Мы с уважением относимся к каждому клиенту и готовы предоставить лучшие условия. Обращайтесь ко мне по номеру +79127655400 - всегда помогу и решу любые вопросы!",
    photo: "/img/pics/manager.png",
};

const depotTenants = [
    {
        id: 1,
        logo: "/img/pics/depot_tenants/borsch.webp",
        title: "Сеть столовых Борщ",
        link: "https://borshch18.ru",
        text: "Сеть столовых «Борщ» предлагает широкий выбор полноценных завтраков и обедов с разнообразным меню на каждый день. Компания имеет собственное производство с соблюдением всех стандартов и требований. Мы готовим только из свежих и качественных продуктов. Привезём обеды на дом, в офис, организуем корпоративное питание. Мы экономим ваше время, чтобы Вы провели его с близкими."
    },
    {
        id: 2,
        logo: "/img/pics/depot_tenants/ural.webp",
        title: "УралЭнерго",
        link: "https://www.u-energo.ru",
        text: "«Уралэнерго» - это комплексные решения в сфере электротехники для ваших задач - от технической консультации и разработки проекта до поставки и монтажа электротехнической, кабельно-проводниковой и светотехнической продукции. Опыт работы на рынке – 20 лет. В портфеле более 200 российских и зарубежных производителей, на сегодня «Уралэнерго» предлагает порядка миллиона наименований изделий. Ассортимент позволяет нам предложить сразу несколько решений по каждому электротехническому направлению, будь то высоковольтное оборудование или светотехника. ",
    },
    {
        id: 3,
        logo: "/img/pics/depot_tenants/spezavto.webp",
        title: "Регоператор УР Спецавтохозяйство",
        link: "https://xn--80afebbua4aociifcc1afoc.xn--p1ai/",
        text: "ООО «Спецавтохозяйство» — официальный региональный оператор по обращению с ТКО в Удмуртии.",
    },
    {
        id: 4,
        logo: "/img/pics/depot_tenants/rso.webp",
        title: "Русское стрелковое оружие",
        link: "https://business.kalashnikov.market/",
        text: "Компания «Русское Стрелковое Оружие» входит в группу компаний «Калашников» и является официальным дистрибьютором гражданской продукции АО «Концерн «Калашников» и АО «Ижевский Механический Завод»",
    },
    {
        id: 5,
        logo: "/img/pics/depot_tenants/mayak.webp",
        title: "Гипермаркет Маяк",
        link: "https://mayakgm.ru/",
        text: "Федеральная сеть гипермаркетов низких цен МАЯК. Это розничный склад-магазин самообслуживания, работающий в режиме жесткого дискаунтера. В ассортименте продукты питания и товары для дома по самым выгодным ценам. Мы предлагаем только лучшие цены на продукцию в каждом из сегментов. Наша миссия — обеспечение вас действительно качественными товарами по самым низким в регионе ценам!",
    },
    {
        id: 6,
        logo: "/img/pics/depot_tenants/chizhik.webp",
        title: "Чижик",
        link: "https://chizhik.club/",
        text: "Чижик - это магазины с качественными продуктами и товарами по улётным ценам. Наши цены такие низкие, потому что в Чижике нет лишних процессов и расходов. Больше нужного, Меньше лишнего.",
    },
    {
        id: 7,
        logo: "/img/pics/depot_tenants/grass.webp",
        title: "Grass",
        link: "https://grass.su/",
        text: "Grass – это ведущий российский производитель профессиональной автохимии и  моющих средств, который представлен в каждом российском регионе и более чем 65 странах мира. Они поставляют свою продукцию в клининговые компании, розничные и сетевые магазины, промышленные предприятия. Продукция Grass изготавливается на собственном заводе в России. Использование качественного сырья, профессионализм сотрудников и накопленный опыт позволяют производить продукцию, отвечающую самым жёстким европейским стандартам по моющей способности и экологичности. Уже 20 лет Grass работает на чистый результат!",
    },
    {
        id: 8,
        logo: "/img/pics/depot_tenants/KDV.webp",
        title: "KDV",
        link: "https://kdvonline.ru/",
        text: "Компания КДВ производит и реализует собственную продукцию. Основной ассортимент - это кондитерские изделия - печенья, вафли, конфеты и карамель. Также в нашем ассортименте есть бакалейная продукция, снеки, чай, кофе и многое другое. Всё произведено из высококачественных продуктов на современном оборудовании командой профессионалов.",
    },
    {
        id: 9,
        logo: "/img/pics/depot_tenants/5seasons.webp",
        title: "5Сезонов",
        link: "https://5sezonov.com/",
        text: "Магазин «5 Сезонов-Дисконт» - это стильные аксессуары на любой сезон по максимально выгодным ценам. Шапки и шляпы, платки, палантины, шарфы, перчатки, ремни, зонты, сумки, портмоне, солнцезащитные очки и многое другое. Мужские и женские сезонные коллекции и всесезонные товары. Добавьте красок в ваш гардероб, подчеркните свою индивидуальность с помощью аксессуаров из магазина «5 Сезонов-Дисконт».",
    },
    {
        id: 10,
        logo: "/img/pics/depot_tenants/sdek.webp",
        title: "СДЭК",
        link: "https://www.cdek.ru/ru/",
        text: "Пункт СДЭК. Российский оператор экспресс-доставки документов и грузов. Сегодня СДЭК — гораздо больше, чем просто доставка. Это экосистема сервисов для людей. Главный принцип этой экосистемы — забота о клиенте и о сотруднике.",
    },
    {
        id: 11,
        logo: "/img/pics/depot_tenants/ozon.webp",
        title: "ОЗОН",
        link: "https://www.ozon.ru/geo/izhevsk/",
        text: "Ozon — современная платформа e-commerce. Режим работы пункта выдачи OZON в ДЕПО – с 09:00 до 21:00. Забирайте свои заказы в любое время, удобное для Вас.",
    },
    {
        id: 12,
        logo: "/img/pics/depot_tenants/melofon.webp",
        title: "Мелофон",
        link: "https://melofon18.ru/",
        text: "Мобильные аксессуары Мелофон. Сеть магазинов, в которых представлен полный ассортимент аксессуаров для сотовых телефонов, смартфонов и планшетов, флешки, автомобильные товары, батареи и зарядные устройства, защитные плёнки, карты памяти, колонки и многое другое. Кроме того, компания осуществляет ремонт гаджетов по низкой цене.",
    },
    {
        id: 13,
        logo: "/img/pics/depot_tenants/oreshki.webp",
        title: "Торговая компания Орешки",
        link: "https://vk.com/oreshkii",
        text: "Магазин «Орешки» - это место, где представлен большой ассортимент орехов, сухофруктов, конфет, фруктов, снековой продукции и много другого по приятным ценам. Сотрудники всегда помогут Вам с выбором, смогут оформить подарочные наборы на Ваш вкус, а так же доставят заказ в необходимое место. И даже в другие города России!",
    },
    {
        id: 14,
        logo: "/img/pics/depot_tenants/kued_myaso.webp",
        title: "Куединский мясокомбинат",
        link: "https://xn--80abidqabgedcxbiilb1ce2ac7y.xn--p1ai/",
        text: "Фирменный магазин Куединского мясокомбината. Магазин предлагает широкий ассортимент продукции, включая различные виды мяса, колбасы, копчености и деликатесы. Куединские мясопродукты – это экологичность, высокое качество, красивый товарный вид и доступные цены. Все продукты изготавливаются из качественных натуральных ингредиентов.",
    },
    {
        id: 15,
        logo: "/img/pics/depot_tenants/zolot_tabak.webp",
        title: "Золотая Табакерка",
        link: "https://vk.com/goldtabakerka?ysclid=lwyqthofx92970824",
        text: "Компания «Золотая табакерка» основана в 2002 году. На сегодняшний день  компания единственная на территории Удмуртской Республики, работающая в формате «Есть всё» по ассортименту табачной продукции.",
    },
    {
        id: 16,
        logo: "/img/pics/depot_tenants/berumebel.webp",
        title: "БеруМебельТут",
        link: "https://redmison.ru/",
        text: "Фирменный отдел мебельной фабрики «Редмисон». «Редмисон» – одно из крупнейших предприятий Удмуртии по производству мягкой мебели и матрасов.",
    },
    {
        id: 17,
        logo: "/img/pics/depot_tenants/gambrinus.webp",
        title: "Гамбринус",
        link: "http://www.gambrinus-izh.ru/",
        text: "Известная сеть магазинов в Ижевске, которая специализируется по продажам разливного и бутылочного фирменного пива и различных закусок к нему. В том числе производят безалкоольные напитки",
    }
];

const gagarinskyTenants = [
    {
        id: 1,
        logo: "/img/pics/gagarinski_tenants/gaz.webp",
        title: "ГАЗ автосервис",
        link: "https://avtogaz18.ru/service-and-spareparts/",
        text: "Предприятие ООО «АвтоГазСервис», является официальным дилером Горьковского автомобильного завода, по обслуживанию и ремонту автомобилей марки ГАЗ. Сервисный центр произведет как глубокий ремонт с пересборкой, так и плановое обслуживание дизельного или бензинового двигателя коммерческого, некоммерческого и легкового транспорта. Современное оборудование в паре с профессионализмом команды сервиса позволяет производить ремонт двигателей даже иностранного производства. Что мы предлагаем нашим клиентам? Подъемники и пост диагностики, смотровые ямы (в том числе для удлиненных автомобилей до 10 м), моторный участок, агрегатный участок.",
    },
    {
        id: 2,
        logo: "/img/pics/gagarinski_tenants/musorovoz.webp",
        title: "Мусоровозов",
        link: "https://xn--18-dlcay2aoabbrkz.xn--p1ai/",
        text: "ООО «Мусоровозов» осуществляет деятельность по обращению с отходами с 2010 года и является одним из крупнейших транспортировщиков отходов на территории Удмуртской Республики, а также оператором по обращению с твердыми коммунальными отходами (ТКО).",
    },
    {
        id: 3,
        logo: "/img/pics/gagarinski_tenants/sereb_kluchi.webp",
        title: "Серебряные ключи +",
        link: "https://voda18.ru/",
        text: "АО «Серебряные ключи» - единственное предприятие в Удмуртии, которое производит минеральные воды всех групп: лечебные, лечебно-столовые, минерализованные, безалкогольные воды, квасные и сокосодержащие напитки. Вся продукция производится из чистейшей артезианской воды. «Серебряные ключи +» это сеть автоматизированных киосков по продаже артезианской воды в розлив «Серебряные ключи +» в городе Ижевске.",
    },
    {
        id: 4,
        logo: "/img/pics/gagarinski_tenants/rmt.webp",
        title: "РМТ Волга",
        link: "https://www.coppertubes.ru/",
        text: "Компания «Русские Медные Трубы» занимает лидирующие  позиции на рынке России и стран Таможенного Союза по поставкам комплектующих и расходных материалов для систем охлаждения, вентиляции, кондиционирования и отопления. Огромный опыт в поставках медной трубы, фитингов и хладагентов позволяет закрывать потребности любых производственных, торговых и монтажных организаций в качественных и доступных материалах. Сеть складов на всей территории России позволяет ускорить процесс получения товара конечным потребителем. В настоящее время у компании 15 региональных складов и распределительных центров в наиболее экономически-активных регионах страны.",
    },
    {
        id: 5,
        logo: "/img/pics/gagarinski_tenants/nahodka.webp",
        title: "Находка",
        link: "https://nahodka-magazin.ru/",
        text: "«НАХОДКА» -  это сеть магазинов низких  цен, для  покупателей, которые хотят и любят экономить, ценят лучшее соотношение ассортимента, цены и качества. Цены в магазинах нашей сети на 15% ниже среднерыночных цен, за счет минимальной торговой надбавки. Оптимальный ассортимент товара, гарантированного качества и свежести, 85% которого приходится на товары ежедневного спроса, исключает незапланированные покупки, а значит и лишние траты. Работа напрямую с федеральными и местными производителями качественных товаров, позволяет покупателю не переплачивать за «раскрученный» бренд и красочную упаковку.",
    },
    {
        id: 6,
        logo: "/img/pics/gagarinski_tenants/food_service.webp",
        title: "Food Сервис",
        link: "https://food-s.ru/",
        text: "Компания «FOOD-Сервис» предлагает крупнейший выбор профессионального кухонного, холодильного оборудования и инвентаря, а также проектирование и сопутствующие сервисные услуги. Компания более 8 лет успешно занимается покупкой и продажей б/у оборудования, а также поставкой нового оборудования для кафе, ресторанов, предприятий общественного питания и магазинов.",
    },
    {
        id: 7,
        logo: "/img/pics/gagarinski_tenants/borsch.webp",
        title: "Сеть столовых Борщ",
        link: "https://borshch18.ru/",
        text: "Сеть столовых «Борщ» предлагает широкий выбор полноценных завтраков и обедов с разнообразным меню на каждый день. Компания имеет собственное производство с соблюдением всех стандартов и требований. Мы готовим только из свежих и качественных продуктов. Привезём обеды на дом, в офис, организуем корпоративное питание. Мы экономим ваше время, чтобы Вы провели его с близкими.",
    },
    {
        id: 8,
        logo: "/img/pics/gagarinski_tenants/nash_garazh.webp",
        title: "Наш Гараж",
        link: "https://nashgarazh-rf.ru/",
        text: "Компания НАШ ГАРАЖ официальный дилер ведущих производителей ворот и автоматики HORMANN, ALUTECH, DoorHan, а также итальянских производителей BFt, Nice и CAMEt.На рынке с 2015 года. Оснащаем ваши дома оборудованием, которое делает жизнь комфортной и безопасной. ГАРАНТИЯ до 10 ЛЕТ. Продаем и устанавливаем: ворота, автоматику к воротам, шлагбаумы, калитки, рольставни.",
    },
    {
        id: 9,
        logo: "/img/pics/gagarinski_tenants/tis.webp",
        title: "Транспортные информационные системы",
        link: "https://www.strizh18.ru/",
        text: "Транспортные информационные системы. Оборудование для автоматизации промышленных предприятий",
    },
    {
        id: 10,
        logo: "/img/pics/gagarinski_tenants/kued_myaso.webp",
        title: "Куединский мясокомбинат",
        link: "https://xn--80abidqabgedcxbiilb1ce2ac7y.xn--p1ai/",
        text: "Фирменный магазин Куединского мясокомбината. Магазин предлагает широкий ассортимент продукции, включая различные виды мяса, колбасы, копчености и деликатесы. Куединские мясопродукты – это экологичность, высокое качество, красивый товарный вид и доступные цены. Все продукты изготавливаются из качественных натуральных ингредиентов.",
    },
    {
        id: 11,
        logo: "/img/pics/gagarinski_tenants/zolot_tabak.webp",
        title: "Золотая Табакерка",
        link: "https://vk.com/goldtabakerka",
        text: "Компания «Золотая табакерка» основана в 2002 году. На сегодняшний день  компания единственная на территории Удмуртской Республики, работающая в формате «Есть всё» по ассортименту табачной продукции.",
    },
    {
        id: 12,
        logo: "/img/pics/gagarinski_tenants/svoya_koleya.webp",
        title: "Сервисный центр Своя Колея",
        link: "https://skoleya.ru/",
        text: "Внедорожная Мастерская «Своя Колея» специализируется на доработке и тюнинге внедорожников. Мы подготавливаем технику к экстремальному бездорожью, охоте и рыбалке.",
    }
];

const yujnayaTenants = [
    {
        id: 1,
        logo: "/img/pics/yujnaya_tenants/upravdom.webp",
        title: "УправДом",
        link: "https://izhevsk.upravdom.com/",
        text: "Профессиональная сеть магазинов напольных покрытий. Оптово-розничная компания «Управдом» основана в 2002 году и сегодня является лидером по продаже напольных покрытий. Магазин «Управдом» — крупнейший в городе центр продаж напольных покрытий. Здесь можно приобрести: линолеум, ламинат, кварцвиниловый и SPC ламинат, паркетную и инженерную доску, ПВХ-плитку, пробковое покрытие и многое другое! Представляем ведущие бренды: Quick Step, Kronospan, Krono Original, Classen, Upofloor, Polarwood и другие. Компания предоставляет полный комплекс дополнительных услуг: замер помещения, доставку товара, подъем на этаж, демонтаж старых покрытий, укладку напольных покрытий.",
    },
    {
        id: 2,
        logo: "/img/pics/yujnaya_tenants/mnogo_mebeli.webp",
        title: "Много Мебели",
        link: "https://mnogomebeli.com/",
        text: "«Много Мебели» — российская компания, производящая и реализующая мягкую и корпусную мебель для дома. Крупнейший российский производитель диванов и диван-кроватей, мебель реализуется через розничную сеть, а также через интернет-магазин. Наши цены – самые доступные, потому что мы продаём мебель огромными объёмами, а производством, доставкой, хранением и сервисным обслуживанием занимаются только проверенные и надёжные партнёры, выполняющие свою работу профессионально, быстро и без лишних затрат.",
    },
    {
        id: 3,
        logo: "/img/pics/yujnaya_tenants/ariva.webp",
        title: "Арива",
        link: "https://a-pricep.ru/",
        text: "С момента основания компания Арива занимается легковыми прицепами и всем, что с ними связано, а это: 1. продажа прицепов марки МЗСА 2. продажа и установка фаркопов (ТСУ), электрики для фаркопов, смарт-коннектов 3. продажа запчастей для легковых прицепов 4. прокат прицепов 5. изготовление, продажа и установка тентов и каркасов для легковых прицепов 6. ремонт прицепов, фаркопов, электрики фаркопов 7. модернизация и тюнинг легковых прицепов. Мы имеем постоянно пополняемый большой склад прицепов, фаркопов и запчастей. Организуем Доставку в любой город по России.",
    },
    {
        id: 4,
        logo: "/img/pics/yujnaya_tenants/keramo_market.webp",
        title: "Керамо-Маркет",
        link: "https://yandex.ru/profile/1091094439",
        text: "Основной ассортимент компании: керамическая плитка, затирка, керамогранит, уголки на ванну керамические, грунтовка, мозаика, плиточный клей.",
    },
    {
        id: 5,
        logo: "/img/pics/yujnaya_tenants/ametist.webp",
        title: "Аметист",
        link: "https://ametist-store.ru/",
        text: "Компания АМЕТИСТ работает на российском рынке уже более 28 лет и входит в число лидеров мебельной отрасли. Компания является надежным бизнес-партнером и поставщиком качественных комплектующих и тканей, которые используются для изготовления удобной и современной мебели. В перечне предлагаемого ассортимента насчитывается более 5000 наименований продукции от известных производителей из стран Европы и юго-восточной Азии. Вся продукция представлена в широком ценовом диапазоне. Партнерами компании являются более 3000 различных производителей корпусной и мягкой мебели из десятков регионов по всей территории России. Компания предлагает следующий ассортимент продукции: мебельные ткани, кожа (натуральная и искусственная), внутренняя и лицевая фурнитура для мягкой и корпусной мебели, различные виды наполнителей, мебельный клей, механизмы трансформации, алюминиевые и пластиковые системы, различные виды аксессуаров и гаджетов для мебели, светильники, материалы для контрактных проектов, товары для дома.",
    },
    {
        id: 6,
        logo: "/img/pics/yujnaya_tenants/hollmart.webp",
        title: "HOLLmart",
        link: "https://hollmart.me/",
        text: "Мебельмаркет Hollmart – сеть магазинов мебели, которые позволят вам обустроить дом и сэкономить деньги. Hollmart – это: удобная и функциональная мебель, широкий ассортимент товаров, идеи для создания уютного интерьера, доступные цены! Мы предлагаем выгодные (экономичные) решения для вашего интерьера.",
    },
];

if (appConfig.base === 'depo') {
    var baseName = 'ДЕПО АО';
    var manager = depotManager;
    var tenants = depotTenants;
} else if (appConfig.base === 'gagarinsky') {
    var baseName = 'ГАГАРИНСКИЙ ПКЦ';
    var manager = gagarinskyManager;
    var tenants = gagarinskyTenants;
} else if (appConfig.base === 'yujnaya') {
    var baseName = 'База Южная';
    var manager = yujnayaManager;
    var tenants = yujnayaTenants;
}

router
    .route('/search')
    .post(dbController.getRoomsSearch);

router
    .route('/search/types')
    .get(dbController.getRoomsTypes);

router
    .route('/search/buildings')
    .get(dbController.getRoomsLiters);

router
    .route('/report/:base')
    .get(dbController.getRoomsReport);

router
    .route('/premises/:id')
    .get(dbController.getRoomsById);

router
    .route('/premises/floormap/:id')
    .get(dbController.getRoomsByBuilding);

router
    .route('/premises/complex/:id')
    .get(dbController.getRoomsByComplex);

router
    .route('/recommendations/:id')
    .get(dbController.getRoomsRecommended);

router
    .route('/rented')
    .get(auth, dbController.getRoomsByTenant);

router
    .route('/requests')
    .get(auth, dbController.getTicketsByTenant);

router
    .route('/request/create')
    .post(auth, dbController.insertTicketFromBackoffice);

router
    .route('/tenant/tg')
    .get(auth, dbController.getTenantTgUsername);

router
    .route('/tenant/tg')
    .post(auth, dbController.setTenantTgUsername);

router
    .route('/promotions')
    .post(auth, dbController.setRoomsPromotions);

router
    .route('/docs')
    .get(auth, dbController.getDocsByUser);

router
    .route('/residents')
    .get(dbController.getResidents);

router
    .route('/residents/backoffice')
    .get(auth, dbController.getResidents);

router.route('/report/print/:base')
    .get(dbController.getRoomsReportMiddleware, async (req, res) => {
        try {
            const rooms = req.rooms;

            if (rooms?.length > 0) {
                const list = rooms.map(item => {
                    const total = parseInt(item.total);
                    const rented = parseInt(item.rented);
                    let type_percentage = parseFloat(item.type_percentage);
                    let rented_percentage = parseFloat(item.rented_percentage);

                    if (isNaN(total) || isNaN(rented) || isNaN(type_percentage) || isNaN(rented_percentage)) {
                        throw 'Invalid data';
                    }

                    type_percentage = Math.round(type_percentage);
                    rented_percentage = Math.round(rented_percentage);

                    return {
                        type: item.type,
                        total: total,
                        rented: rented,
                        available: total - rented,
                        type_percentage: type_percentage,
                        rented_percentage: rented_percentage,
                        available_percentage: 100 - rented_percentage,
                    };
                });

                const aggregatedData = list.reduce((acc, curr) => {
                    acc.total += curr.total;
                    acc.rented += curr.rented;
                    return acc;
                }, {
                    total: 0,
                    rented: 0,
                });

                aggregatedData.available = aggregatedData.total - aggregatedData.rented;
                aggregatedData.rented_percentage = Math.round(aggregatedData.rented / aggregatedData.total * 100);
                aggregatedData.available_percentage = 100 - aggregatedData.rented_percentage;

                const reportData = {
                    aggregatedData,
                    types: list,
                    generatedAt: new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                };

                res.render('nodes/report-print', reportData);
            }
        } catch (error) {
            console.error('Error fetching report data:', error);
            res.status(500).send('Error generating report');
        }
    });

router
    .route('/login')
    .post(async (req, res) => {
        try {
            const { login, password } = req.body;
            let user;

            if (/\S+@\S+\.\S+/.test(login)) {
                // Login using email
                user = await dbController.getTenantByParam({ 'email': login });
            } else if (/^\d+$/.test(login)) {
                // Login using TIN
                user = await dbController.getTenantByParam({ 'tin': login });
            } else {
                return res.status(400).json({ success: false, message: 'Invalid login format' });
            }

            if (!user || user.password == null) {
                return res.status(400).json({ success: false, message: 'No such user' });
            }

            if (await bcrypt.compare(password, user.password)) {
                const token = generateToken({ id: user.id, status: user.status, name: user.name });

                return res.cookie("secretToken", token, { httpOnly: true }).json({ success: true });
            } else {
                return res.status(400).json({ success: false, message: 'Wrong password' });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Failed to login' });
        }
    });

router
    .route('/signup/check')
    .post(async (req, res) => {
        try {
            const { tin } = pick(req.body, ['tin']);

            user = await dbController.getTenantByParam({ tin });
            if (user) {
                return res.status(200).json({ exists: true, signedUp: user.email !== '' });
            }
            return res.status(404).json({ exists: false });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Failed to check tin' });
        }
    });

router
    .route('/signup/verify-email')
    .post(async (req, res) => {
        try {
            const { tin, email } = pick(req.body, ['tin', 'email']);

            const user = await dbController.getTenantByParam({ tin });

            if (user) {
                const token = generateToken({ id: user.id, email }, true);
                await sendVerificationEmail(email, token, true);
                return res.status(200).json({ message: 'Verification email sent' });
            }

            return res.status(404).json({ message: 'TIN not found' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Failed to verify email' });
        }
    });

router
    .route('/password-reset/initiate')
    .post(async (req, res) => {
        try {
            const { tin, email } = pick(req.body, ['tin', 'email']);

            user = await dbController.getTenantByParam({ tin, email });

            if (user) {
                const token = generateToken({ id: user.id, email }, true);
                await sendVerificationEmail(email, token, false);
                return res.status(200).json({ message: 'Password reset email sent' });
            }

            return res.status(404).json({ message: 'User not found' });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Failed to verify email' });
        }
    });

router
    .route('/reset-password')
    .post(async (req, res) => {
        const { password, confirmPassword, token } = pick(req.body, ['password', 'confirmPassword', 'token']);

        if (!token) {
            return res.status(400).json({ success: false, message: 'No reset token found' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }

        try {
            jwt.verify(token, jwtConfig.emailToken, async (err, decoded) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send("Email verification failed, possibly the link is invalid or expired");
                }
                const hashedPassword = await bcrypt.hash(password, 10);

                const user = await dbController.setTenantPassword(decoded.id, hashedPassword);

                return res.status(200).json({ success: true, message: 'Password reset successfully' });
            });
        } catch (err) {
            console.log(err);
            res.status(400).json({ success: false, message: 'Failed to reset password' });
        }
    });

router
    .route('/contact')
    .post(async (req, res) => {
        const { name, email, phone, url } = pick(req.body, ['name', 'email', 'phone', 'url']);

        try {
            const response = await axios.post(`${bitrixConfig.url}/crm.lead.add`, {
                fields: {
                    TITLE: `Заявка от ${name}`,
                    NAME: name,
                    EMAIL: [{ VALUE: email }],
                    PHONE: [{ VALUE: phone }],
                    WEB: [{ VALUE: url, VALUE_TYPE: baseName }],
                }
            });
            res.json({ success: true, data: response.data });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

router
    .route('/docs/sign')
    .post(auth, async (req, res) => {
        const { docId, docName, signType, operator } = pick(req.body, ['docId', 'docName', 'signType', 'operator']);
        const user = req.user;

        try {
            const response = await axios.post(`${bitrixConfig.url}/crm.lead.add`, {
                fields: {
                    TITLE: `Заявка на подпись договора ${docName}`,
                    NAME: user.name,
                    COMMENTS: `${docName} (ID: ${docId}), подписание ${signType} ${(operator ? operator : '')}`
                }
            });
            res.json({ success: true, data: response.data });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

router
    .route('/docs/request')
    .post(auth, async (req, res) => {
        const { docType, customRequest } = pick(req.body, ['docType', 'customRequest']);
        const user = req.user;

        try {
            const response = await axios.post(`${bitrixConfig.url}/crm.lead.add`, {
                fields: {
                    TITLE: `Заказ документа ${customRequest ? customRequest : docType}`,
                    NAME: user.name,
                    COMMENTS: `Заказан документ ${(customRequest ? customRequest : docType)}`
                }
            });
            res.json({ success: true, data: response.data });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
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
    .route('/manager/update')
    .post(auth, async (req, res) => {
        try {
            const data = pick(req.body, 'name', 'text', 'photo');
            res.status(200).json({ success: true });;
        } catch (error) {
            res.status(404).json({ error: 'Manager not updated' });
        }
    });

router
    .route('/photo')
    .post(auth, async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                if (err instanceof multer.MulterError) {
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        return res.status(400).json({ code: 'FILE_SIZE_LIMIT', message: 'Файл превышает максимальный размер 10 МБ' });
                    }
                    return res.status(400).json({ code: 'MULTER_ERROR', message: 'Ошибка при загрузке файла', error: err.message });
                } else {
                    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Ошибка сервера', error: err.message });
                }
            }

            const file = req.file;
            const { id } = pick(req.body, ['id']);

            if (!file) {
                return res.status(400).json({ code: 'NO_FILES', message: 'Файл не найден' });
            }

            try {
                const metadata = await sharp(file.buffer).metadata();
                if (metadata.width < 550 || metadata.height < 309) {
                    return res.status(400).json({ code: 'FILE_TOO_SMALL', message: 'Изображение слишком маленькое. Минимальные размеры: 550x309' });
                }

                const webpBuffer = await sharp(file.buffer)
                    .resize({
                        width: 550,
                        height: Math.round(550 * 9 / 16),
                        fit: sharp.fit.cover,
                    })
                    .webp()
                    .toBuffer();

                const filename = crypto.randomBytes(10).toString('hex').substr(0, 10) + '.webp';
                const uploadDir = path.join(__dirname, '..', `static/uploads/${id}`);
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                const outputPath = path.join(uploadDir, filename);
                const filePath = `/uploads/${id}/${filename}`;

                await fs.promises.writeFile(outputPath, webpBuffer);
                await dbController.setRoomsPhotoById(id, filePath);

                res.json({ message: 'Файл успешно загружен', fileUrl: filePath });
            } catch (error) {
                // console.log('Error uploading photo:', error.message);
                res.status(500).json({ code: 'UPLOAD_ERROR', message: 'Ошибка при загрузке фотографии' });
            }
        });
    });

router
    .route('/photo')
    .delete(auth, async (req, res) => {
        const { id, photoUrl } = pick(req.body, ['id', 'photoUrl']);

        try {
            const fullPath = path.join(__dirname, '..', `static${photoUrl}`);
            
            if (fs.existsSync(fullPath)) {
                await fs.promises.unlink(fullPath);
            } else {
                return res.status(404).json({ code: 'FILE_NOT_FOUND', message: 'Файл не найден' });
            }
    
            const success = await dbController.setRoomsDeletePhotoById(id, photoUrl);
    
            if (success) {
                res.json({ message: 'Фотография успешно удалена' });
            } else {
                res.status(500).json({ code: 'DB_ERROR', message: 'Ошибка при обновлении базы данных' });
            }
        } catch (error) {
            console.error('Error deleting photo:', error);
            res.status(500).json({ code: 'DELETE_ERROR', message: 'Ошибка при удалении фотографии' });
        }
    });

module.exports = router;