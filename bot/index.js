const { Scenes, Markup, Telegraf, session } = require('telegraf');
const config = require('../config/botConfig');
const db = require('../controllers/dbController');

class SceneGenerator {
    AuthScene() {
        const authScene = new Scenes.BaseScene('AUTH_SCENE');

        authScene.enter(async (ctx) => {
            try {
                // let user = await db.getUser(ctx.from.id);
                const user = true;

                if (user) {
                    ctx.reply("Добро пожаловать, " + user.name + "!");
                    return ctx.scene.enter('MAIN_MENU_SCENE');
                } else {
                    ctx.reply("Неверный идентификатор пользователя!");
                }
            } catch (e) {
                ctx.reply("Ошибка!");
                console.log(e.message);
            }
        });

        authScene.command('start', (ctx) => {
            ctx.scene.reenter();
        });

        return authScene;
    }

    MainMenuScene() {
        const menuScene = new Scenes.BaseScene('MAIN_MENU_SCENE');

        menuScene.enter((ctx) => {
            ctx.reply(
                "Выберите пункт меню:",
                Markup.keyboard(["Написать обращение", "Мои обращения"]).oneTime().resize(),
            );
        });

        menuScene.hears("Написать обращение", (ctx) => {
            return ctx.scene.enter('CREATE_TICKET_SCENE');
        });

        menuScene.hears("Мои обращения", (ctx) => {
            return ctx.scene.enter('TICKET_HISTORY_SCENE');
        });

        return menuScene;
    }

    CreateTicketScene() {
        const createTicketScene = new Scenes.BaseScene('CREATE_TICKET_SCENE');

        createTicketScene.enter((ctx) => {
            ctx.reply("Опишите ваше обращение. Вы также можете прикрепить файлы.");
        });

        createTicketScene.on("message", async (ctx) => {
            try {
                const message = ctx.message.text || '';
                const user = await db.getUser(ctx.from.id);

                // Handle file attachments if any
                const attachments = ctx.message.document || ctx.message.photo || [];

                const ticket = await db.create({
                    userId: user.id,
                    message: message,
                    status: 'Новое',
                    lastUpdate: new Date(),
                });

                // Handle sending files to your storage system if needed

                ctx.reply("Ваше обращение зарегистрировано!");
                return ctx.scene.enter('MAIN_MENU_SCENE');
            } catch (e) {
                ctx.reply("Ошибка!");
                console.log(e.message);
            }
        });

        return createTicketScene;
    }

    TicketHistoryScene() {
        const ticketHistoryScene = new Scenes.BaseScene('TICKET_HISTORY_SCENE');

        ticketHistoryScene.enter(async (ctx) => {
            await this.sendTicketList(ctx, 0);
        });

        ticketHistoryScene.on("text", async (ctx) => {
            const text = ctx.message.text;
            if (text === 'Дальше') {
                const offset = ctx.session.ticketOffset || 0;
                await this.sendTicketList(ctx, offset + 9);
            } else {
                const index = parseInt(text);
                if (!isNaN(index)) {
                    const user = await db.getUser(ctx.from.id);
                    const tickets = await db.findAll({ where: { userId: user.id } });
                    const ticket = tickets[index - 1];
                    if (ticket) {
                        ctx.reply(`Статус: ${ticket.status}\nПоследнее обновление: ${ticket.lastUpdate}`);
                    } else {
                        ctx.reply("Неверный индекс.");
                    }
                } else {
                    ctx.reply("Неверная команда.");
                }
            }
        });

        ticketHistoryScene.sendTicketList = async function (ctx, offset) {
            try {
                const user = await db.getUser(ctx.from.id);
                const tickets = await db.findAll({ where: { userId: user.id }, offset: offset, limit: 9 });

                if (tickets.length > 0) {
                    const ticketList = tickets.map((ticket, index) => `${index + 1 + offset}. ${ticket.message}`).join('\n');
                    const keyboard = Markup.keyboard([...Array(tickets.length).keys()].map(i => `${i + 1}`)).oneTime().resize();

                    if (tickets.length === 9) {
                        keyboard.keyboard.push(['Дальше']);
                        ctx.session.ticketOffset = offset;
                    }

                    ctx.reply(`Ваши обращения:\n${ticketList}`, keyboard);
                } else {
                    ctx.reply("У вас нет обращений.");
                    return ctx.scene.enter('MAIN_MENU_SCENE');
                }
            } catch (e) {
                ctx.reply("Ошибка!");
                console.log(e.message);
            }
        };

        return ticketHistoryScene;
    }
}

const createBot = () => {
    try {
        const bot = new Telegraf(config.token);

        bot.use(session());

        const stage = new Scenes.Stage([
            new SceneGenerator().AuthScene(),
            new SceneGenerator().MainMenuScene(),
            new SceneGenerator().CreateTicketScene(),
            new SceneGenerator().TicketHistoryScene(),
        ]);

        bot.use(stage.middleware());

        bot.command('start', (ctx) => ctx.scene.enter('AUTH_SCENE'));

        bot.catch((err, ctx) => {
            console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
            ctx.reply("Произошла ошибка, пожалуйста, повторите попытку позже.");
        });

        bot.launch();

        return bot;
    } catch (error) {
        console.log('Telegram bot creation error: ', error);
    }
};


module.exports = createBot();