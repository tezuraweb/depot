const { Scenes, Markup } = require('telegraf');
const db = require('../../controllers/dbController');

const createTicketHistoryScene = () => {
    const ticketHistoryScene = new Scenes.BaseScene('TICKET_HISTORY_SCENE');

    ticketHistoryScene.enter(async (ctx) => {
        await sendTicketList(ctx, 0);
    });

    ticketHistoryScene.on("text", async (ctx) => {
        const text = ctx.message.text;
        if (text === 'Дальше') {
            const offset = ctx.session.ticketOffset || 0;
            await sendTicketList(ctx, offset + 9);
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

    const sendTicketList = async (ctx, offset) => {
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
};

module.exports = createTicketHistoryScene;
