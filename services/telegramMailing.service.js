require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');

class TelegramMailing {
    constructor() {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        this.bot = new TelegramBot(token, {polling: true});

        this.bot.on('message', (msg) => {
            const chatId = msg.chat.id;

            bot.sendMessage(chatId, 'Received your message');
          });
    }

    SendLead(data) {
        const chatId = process.env.TELEGRAM_ADMIN_CHAT || null;
    
        if (chatId) {
            this.bot.sendMessage(chatId, data);
        }
    }
}

module.exports = new TelegramMailing();