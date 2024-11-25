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
    name: "Денис Грибасов",
    text: "В нашем ТСК созданы все условия для эффективного ведения бизнеса! Мы работаем для Вас и всегда строим доверительные отношения с нашими клиентами и партнерами! 24/7 я на связи по номеру +79658507324. Обращайтесь, помогу решить любые вопросы!",
    photo: "/img/pics/depo_manager.webp",
};

const gagarinskyManager = {
    id: 1,
    name: "Пивоваров Денис Олегович",
    text: "Мы знаем, как важно создавать условия для комфортной работы наших клиентов и партнеров. И работаем над этим ежедневно. Я всегда на связи по номеру +79120203331, открыт для предложений и готов помочь.",
    photo: "/img/pics/gagarinskii_manager.webp",
};

const yujnayaManager = {
    id: 1,
    name: "Оксана Гильфанова",
    text: "Выгодные условия для ведения бизнеса вы всегда сможете найти на Базе “Южной”! Мы с уважением относимся к каждому клиенту и готовы предоставить лучшие условия. Обращайтесь ко мне по номеру +79511974777 - всегда помогу и решу любые вопросы!",
    photo: "/img/pics/yujnaya_manager.png",
};

if (appConfig.base === 'depo') {
    var baseName = 'ДЕПО АО';
    var manager = depotManager;
} else if (appConfig.base === 'gagarinsky') {
    var baseName = 'ГАГАРИНСКИЙ ПКЦ ООО';
    var manager = gagarinskyManager;
} else if (appConfig.base === 'yujnaya') {
    var baseName = 'База Южная ООО';
    var manager = yujnayaManager;
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
    .route('/search/amount')
    .get(dbController.getRoomsAmounts);

router
    .route('/search/floors')
    .get(dbController.getRoomsFloors);

router
    .route('/premises/:id')
    .get(dbController.getRoomsById);

router
    .route('/premises/floormap/:id')
    .get(dbController.getRoomsByBuilding);

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

router
    .route('/residents/create')
    .put(auth, dbController.insertResident);

router
    .route('/residents/update')
    .post(auth, dbController.alterResidentById);

router
    .route('/residents/delete/:id')
    .delete(auth, dbController.deleteResident);

router
    .route('/report')
    .get(dbController.getReport);

// router.route('/report/print/:base')
//     .get(dbController.getReportMiddleware, async (req, res) => {
//         try {
//             const report = req.report;

//             if (report?.length > 0) {
//                 const list = rooms.map(item => {
//                     const total = parseInt(item.total);
//                     const rented = parseInt(item.rented);
//                     let type_percentage = parseFloat(item.type_percentage);
//                     let rented_percentage = parseFloat(item.rented_percentage);

//                     if (isNaN(total) || isNaN(rented) || isNaN(type_percentage) || isNaN(rented_percentage)) {
//                         throw 'Invalid data';
//                     }

//                     type_percentage = Math.round(type_percentage);
//                     rented_percentage = Math.round(rented_percentage);

//                     return {
//                         type: item.type,
//                         total: total,
//                         rented: rented,
//                         available: total - rented,
//                         type_percentage: type_percentage,
//                         rented_percentage: rented_percentage,
//                         available_percentage: 100 - rented_percentage,
//                     };
//                 });

//                 const aggregatedData = list.reduce((acc, curr) => {
//                     acc.total += curr.total;
//                     acc.rented += curr.rented;
//                     return acc;
//                 }, {
//                     total: 0,
//                     rented: 0,
//                 });

//                 aggregatedData.available = aggregatedData.total - aggregatedData.rented;
//                 aggregatedData.rented_percentage = Math.round(aggregatedData.rented / aggregatedData.total * 100);
//                 aggregatedData.available_percentage = 100 - aggregatedData.rented_percentage;

//                 const reportData = {
//                     aggregatedData,
//                     types: list,
//                     generatedAt: new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
//                 };

//                 res.render('nodes/report-print', reportData);
//             }
//         } catch (error) {
//             console.error('Error fetching report data:', error);
//             res.status(500).send('Error generating report');
//         }
//     });

router.route('/report/print/:base')
    .get(dbController.getReportMiddleware, async (req, res) => {
        try {
            const reportData = req.report;

            if (reportData?.length > 0) {
                const calculatedData = reportData.reduce((acc, item) => {
                    acc.quantityRoomsSum += (item?.quantityRomms || 0);
                    acc.forRentSum += (item?.forRent || 0);
                    acc.vacantPremisesSum += (item?.vacantPremises || 0);
                    acc.rentalFlowSum += (item?.rentalFlow || 0);
                    acc.potentialrentalFlowSum += (item?.potentialrentalFlow || 0);
                    acc.averagePriceSum += (item?.quantityRomms * item?.averagePrice || 0);
                    acc.percentforRentSum += (item?.forRent * item?.percentforRent || 0);
                    acc.percentvacantPremisesSum += (item?.vacantPremises * item?.percentvacantPremises || 0);
                    return acc;
                }, {
                    quantityRoomsSum: 0,
                    forRentSum: 0,
                    vacantPremisesSum: 0,
                    rentalFlowSum: 0,
                    potentialrentalFlowSum: 0,
                    averagePriceSum: 0,
                    percentforRentSum: 0,
                    percentvacantPremisesSum: 0
                });

                calculatedData.averagePriceAvg = Math.round(calculatedData.averagePriceSum / calculatedData.quantityRoomsSum) || 0;
                calculatedData.percentforRentAvg = Math.round(calculatedData.percentforRentSum / calculatedData.forRentSum) || 0;
                calculatedData.percentvacantPremisesAvg = Math.round(calculatedData.percentvacantPremisesSum / calculatedData.vacantPremisesSum) || 0;

                delete calculatedData.averagePriceSum;
                delete calculatedData.percentforRentSum;
                delete calculatedData.percentvacantPremisesSum;

                const reportInfo = {
                    data: reportData,
                    calculatedData,
                    generatedAt: new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                };

                res.render('nodes/report-print', reportInfo);
            } else {
                res.status(404).send('No report data found');
            }
        } catch (error) {
            console.error('Error processing report data:', error);
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
                user = await dbController.getTenantByParam({ 'email': login });
            } else if (/^\d+$/.test(login)) {
                user = await dbController.getTenantByParam({ 'tin': login });
            } else {
                return res.status(400).json({ success: false, message: 'Неверный формат логина' });
            }

            if (!user || user.password == null ) {
                return res.status(400).json({ success: false, message: 'Пользователь не существует' });
            }

            if (await bcrypt.compare(password, user.password)) {
                if (user.status === 'tenant' && user.organization !== baseName) {
                    return res.status(400).json({ success: false, message: 'Пользователь не существует' });
                } else if (user.status === 'admin' && user.organization !== '' && user.organization !== baseName) {
                    return res.status(400).json({ success: false, message: 'Отказано в доступе' });
                }

                const token = generateToken({ id: user.id, status: user.status, name: user.name });

                return res.cookie("secretToken", token, { httpOnly: true }).json({ success: true });
            } else {
                return res.status(400).json({ success: false, message: 'Неверный пароль' });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Ошибка входа' });
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
            return res.status(500).json({ success: false, message: 'Ошибка проверки ИНН' });
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
                return res.status(200).json({ message: 'Отправлено письмо для верификации' });
            }

            return res.status(404).json({ message: 'TIN not found' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Ошибка верификации почты' });
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
                return res.status(200).json({ message: 'Отрпавлено письмо для сброса пароля' });
            }

            return res.status(404).json({ message: 'Пользователь не найден' });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'Ошибка верификации почты' });
        }
    });

router
    .route('/reset-password')
    .post(async (req, res) => {
        const { password, confirmPassword, token } = pick(req.body, ['password', 'confirmPassword', 'token']);

        if (!token) {
            return res.status(400).json({ success: false, message: 'Не найден токен сброса' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Пароли не совпадают' });
        }

        try {
            jwt.verify(token, jwtConfig.emailToken, async (err, decoded) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send("Верификация не пройдена, ссылка недействительна или устарела");
                }
                const hashedPassword = await bcrypt.hash(password, 10);

                const user = await dbController.setTenantPassword(decoded.id, hashedPassword);

                return res.status(200).json({ success: true, message: 'Пароль сброшен успешно' });
            });
        } catch (err) {
            console.log(err);
            res.status(400).json({ success: false, message: 'Ошибка сброса пароля' });
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
            const { id, model } = pick(req.body, ['id', 'model']);

            if (!file) {
                return res.status(400).json({ code: 'NO_FILES', message: 'Файл не найден' });
            }

            if (id === undefined || !model) {
                return res.status(400).json({ code: 'LACK_OF_DATA', message: 'Недостаточно данных для записи файла' });
            }

            try {
                let minWidth = 0, minHeight = 0;
                if (model === 'rooms') {
                    minWidth = 550;
                    minHeight = 309;
                } else if (model === 'residents') {
                    minHeight = 100;
                }

                const metadata = await sharp(file.buffer).metadata();
                if (metadata.width < minWidth || metadata.height < minHeight) {
                    return res.status(400).json({ code: 'FILE_TOO_SMALL', message: 'Изображение слишком маленькое' });
                }

                if (model === 'rooms') {
                    var webpBuffer = await sharp(file.buffer)
                        .resize({
                            width: 550,
                            height: Math.round(550 * 9 / 16),
                            fit: sharp.fit.cover,
                        })
                        .webp()
                        .toBuffer();
                } else if (model === 'residents') {
                    var webpBuffer = await sharp(file.buffer)
                        .resize({
                            height: 100,
                            fit: sharp.fit.inside,
                        })
                        .webp()
                        .toBuffer();
                }

                const filename = crypto.randomBytes(10).toString('hex').substr(0, 10) + '.webp';
                const uploadDir = path.join(__dirname, '..', `static/uploads/${model}/${id}`);
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                const outputPath = path.join(uploadDir, filename);
                const filePath = `/uploads/${model}/${id}/${filename}`;

                await fs.promises.writeFile(outputPath, webpBuffer);
                
                if (model === 'rooms') {
                    await dbController.setRoomsPhotoById(id, filePath);
                } else if (model === 'residents') {
                    const prevFile = await dbController.setResidentsPhotoById(id, filePath);
                    const fullPath = path.join(__dirname, '..', `static${prevFile}`);

                    if (prevFile && fs.existsSync(fullPath)) {
                        await fs.promises.unlink(fullPath);
                    } else {
                        console.error('Файл для удаления не найден')
                    }
                }

                res.json({ message: 'Файл успешно загружен', fileUrl: filePath });
            } catch (error) {
                console.log(error)
                res.status(500).json({ code: 'UPLOAD_ERROR', message: 'Ошибка при загрузке фотографии' });
            }
        });
    });

router
    .route('/photo')
    .delete(auth, async (req, res) => {
        const { id, photoUrl, model } = pick(req.body, ['id', 'photoUrl', 'model']);

        if (id === undefined || !model) {
            return res.status(400).json({ code: 'LACK_OF_DATA', message: 'Недостаточно данных для записи файла' });
        }

        try {
            const fullPath = path.join(__dirname, '..', `static${photoUrl}`);

            if (photoUrl && fs.existsSync(fullPath)) {
                await fs.promises.unlink(fullPath);
            } else {
                return res.status(404).json({ code: 'FILE_NOT_FOUND', message: 'Файл не найден' });
            }

            if (model === 'rooms') {
                var success = await dbController.setRoomsDeletePhotoById(id, photoUrl);
            } else {
                var success = true;
            }

            if (success) {
                res.json({ message: 'Фотография успешно удалена' });
            } else {
                res.status(500).json({ code: 'DB_ERROR', message: 'Ошибка при обновлении базы данных' });
            }
        } catch (error) {
            console.log('Error deleting photo:', error);
            res.status(500).json({ code: 'DELETE_ERROR', message: 'Ошибка при удалении фотографии' });
        }
    });

module.exports = router;