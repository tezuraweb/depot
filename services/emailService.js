const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const mailConfig = require('../config/mailConfig');

const transporter = nodemailer.createTransport({
    auth: {
        user: mailConfig.address,
        pass: mailConfig.password,
    },
    host: mailConfig.host,
    port: 465,
    secure: true,
});

const sendVerificationEmail = async (email, token) => {
    const mailConfigurations = {
        from: mailConfig.address,
        to: email,
        subject: 'Задание или сброс пароля',
        text: `Добрый день!
            Для задания или сброса пароля перейдите по ссылке:
            http://localhost:3000/auth/reset/${token} 
            Спасибо!`
    };

    try {
        const info = await transporter.sendMail(mailConfigurations);
        console.log('Email Sent Successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const generateToken = (data, isMail = false) => {
    return jwt.sign(data, isMail ? jwtConfig.emailToken : jwtConfig.token, { expiresIn: isMail ? '10m' : '12h' });
};

// const verifyToken = (token, callback) => {
//     jwt.verify(token, jwtConfig.emailToken, callback);
// };

module.exports = {
    sendVerificationEmail,
    generateToken,
    // verifyToken
};
