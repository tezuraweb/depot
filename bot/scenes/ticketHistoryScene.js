const { Scenes, Markup } = require('telegraf');
const db = require('../../controllers/dbController');

const createTicketHistoryScene = () => {
    const ticketHistoryScene = new Scenes.BaseScene('TICKET_HISTORY_SCENE');

    ticketHistoryScene.enter(async (ctx) => {
        ctx.session.ticketList = [];
        ctx.session.ticketOffset = 0;
        ctx.session.ticketLimit = 9;
        await sendTicketList(ctx, 0);
    });

    ticketHistoryScene.hears("Выйти", (ctx) => {
        return ctx.scene.enter('MAIN_MENU_SCENE');
    });

    ticketHistoryScene.action(/ticket_\d+/, async (ctx) => {
        const ticketIndex = parseInt(ctx.match[0].split('_')[1]) - 1;
        const ticket = ctx.session.ticketList[ticketIndex];

        if (ticket) {
            const { text, files, photos, status, date } = ticket;
            await ctx.reply(`Статус: ${status}\nДата обновления: ${date}\n\n${text}`,
                Markup.keyboard(['Выйти']).oneTime().resize());

            for (const photoUrl of photos) {
                await ctx.telegram.sendPhoto(ctx.chat.id, photoUrl);
            }
        
            for (const fileId of files) {
                await ctx.telegram.sendDocument(ctx.chat.id, fileId);
            }
        } else {
            ctx.reply("Неверный индекс!",
                Markup.keyboard(['Выйти']).oneTime().resize());
        }
    });

    ticketHistoryScene.action('next_page', async (ctx) => {
        ctx.session.ticketOffset = ctx.session.ticketOffset + ctx.session.ticketLimit;
        await sendTicketList(ctx);
    });

    ticketHistoryScene.action('back', async (ctx) => {
        return ctx.scene.enter('MAIN_MENU_SCENE');
    });

    const showMessage = async (ctx) => {
        try {
            const { text, files, photos, date } = ctx.session.ticketData[ctx.session.msgIndex];
            let keyboard = ctx.session.msgIndex == ctx.session.ticketData.length - 1 ?
                Markup.inlineKeyboard([
                    [Markup.button.callback('Написать ответ', 'reply')],
                    [Markup.button.callback('Назад', 'back')]
                ]) : Markup.inlineKeyboard([
                    [Markup.button.callback('Написать ответ', 'reply')],
                    [Markup.button.callback('Назад', 'back'), Markup.button.callback('Дальше', 'next_msg')]
                ]);

            await ctx.reply(`Дата обновления: ${date}\n\n${text}`,
                keyboard);

            for (const photoUrl of photos) {
                await ctx.telegram.sendPhoto(ctx.chat.id, photoUrl);
            }

            for (const fileId of files) {
                await ctx.telegram.sendDocument(ctx.chat.id, fileId);
            }
        } catch (e) {
            ctx.reply("Ошибка!",
                Markup.keyboard(['Назад']).oneTime().resize());
            console.log(e.message);
        }
    }

    const sendTicketList = async (ctx) => {
        try {
            const tickets = await db.getTicketsByUserBot(ctx.from.id, ctx.session.ticketOffset, ctx.session.ticketLimit);

            if (tickets?.length > 0) {
                const offset = ctx.session.ticketOffset;
                ctx.session.ticketList = ctx.session.ticketList.concat(tickets);

                const ticketList = tickets.map((ticket, index) => `${index + 1 + offset}. ${ticket.date}\n${ticket.text.slice(0, 30)}...`).join('\n\n');

                const keyboardButtons = tickets.map((ticket, index) => 
                    Markup.button.callback(`${index + 1 + offset}`, `ticket_${index + 1 + offset}`)
                );

                const keyboard = [keyboardButtons.slice(0, 3)];
                if (keyboardButtons.length >= 3) {
                    keyboard.push(keyboardButtons.slice(3, 6));
                }
                if (keyboardButtons.length >= 6) {
                    keyboard.push(keyboardButtons.slice(6));
                }

                if (tickets.length === ctx.session.ticketLimit) {
                    keyboard.push([Markup.button.callback('Дальше', 'next_page')]);
                }
                keyboard.push([Markup.button.callback('Выйти', 'back')]);

                ctx.reply(
                    `Ваши обращения:\n\n${ticketList}`,
                    Markup.inlineKeyboard(keyboard));

            } else {
                ctx.reply("У вас нет обращений.");
                return ctx.scene.enter('MAIN_MENU_SCENE');
            }
        } catch (e) {
            ctx.reply("Ошибка!",
                Markup.keyboard(['Выйти']).oneTime().resize());
            console.log(e.message);
        }
    };

    ticketHistoryScene.leave(async (ctx) => {
        ctx.session.ticketOffset = null;
        ctx.session.ticketLimit = null;
        ctx.session.ticketList = null;
    });

    return ticketHistoryScene;
};

module.exports = createTicketHistoryScene;
