const { Scenes, Markup } = require('telegraf');
const db = require('../../controllers/dbController');

const createTicketHandlingScene = () => {
    const statusValues = {
        new: 'новое',
        in_process: 'в процессе',
        closed: 'закрыто',
    }

    const ticketHandlingScene = new Scenes.BaseScene('TICKET_HANDLING_SCENE');

    ticketHandlingScene.enter((ctx) => {
        ctx.session.messageText = '';
        ctx.session.files = [];
        ctx.session.photos = [];
        ctx.session.messageIds = [];
        ctx.reply("Выберите категорию обращений:",
            Markup.keyboard(['Новые обращения', 'В процессе', 'Выйти']).oneTime().resize());
    });

    ticketHandlingScene.hears('Выйти', (ctx) => {
        return ctx.scene.enter('ADMIN_MENU_SCENE');
    });

    ticketHandlingScene.hears('Отмена', (ctx) => {
        return ctx.scene.enter('ADMIN_MENU_SCENE');
    });

    ticketHandlingScene.hears('Новые обращения', async (ctx) => {
        ctx.session.ticketStatus = 'new';
        ctx.session.ticketList = [];
        ctx.session.ticketOffset = 0;
        ctx.session.ticketLimit = 2;
        await sendTicketList(ctx);
    });

    ticketHandlingScene.hears('В процессе', async (ctx) => {
        ctx.session.ticketStatus = 'in_process';
        ctx.session.ticketList = [];
        ctx.session.ticketOffset = 0;
        ctx.session.ticketLimit = 9;
        await sendTicketList(ctx);
    });

    ticketHandlingScene.hears('Подтвердить', async (ctx) => {
        if (ctx.session.currentTicketIndex !== null && ctx.session.currentTicketIndex !== undefined) {
            const ticket = ctx.session.ticketList[ctx.session.currentTicketIndex];

            const ticketReply = await db.insertTicketBot({
                inquirer: ticket.inquirer,
                manager: ctx.from.id,
                text: ctx.session.messageText,
                files: ctx.session.files,
                photos: ctx.session.photos,
                messages: ctx.session.messageIds,
                ticket_number: ticket.ticket_number,
                isNew: false,
            });

            await ctx.telegram.sendMessage(ticket.inquirer, `Ответ на ваше обращение:\n\n${ctx.session.messageText}`);
            for (const photoUrl of ctx.session.photos) {
                await ctx.telegram.sendPhoto(ticket.inquirer, photoUrl);
            }

            for (const fileId of ctx.session.files) {
                await ctx.telegram.sendDocument(ticket.inquirer, fileId);
            }

            ctx.reply("Ваше сообщение отправлено!",
                Markup.keyboard(['Выйти']).oneTime().resize());
            ctx.session.currentTicketIndex = null;

            ctx.scene.reenter('TICKET_HANDLING_SCENE');
        }
    });

    ticketHandlingScene.action('get_chain', async (ctx) => {
        ctx.session.msgIndex = 0;
        showMessage(ctx);
    });

    ticketHandlingScene.action('next_msg', async (ctx) => {
        ctx.session.msgIndex = ctx.session.msgIndex + 1;
        showMessage(ctx);
    });

    ticketHandlingScene.action('get_last', (ctx) => {
        ctx.session.msgIndex = ctx.session.ticketData.length - 1;
        showMessage(ctx);
    });

    ticketHandlingScene.action('reply', (ctx) => {
        ctx.reply("Введите ваше сообщение. Вы также можете прикрепить файлы. Когда закончите, нажмите 'Подтвердить'.",
            Markup.keyboard(['Отмена']).oneTime().resize());
    });

    ticketHandlingScene.action('close', async (ctx) => {
        const ticket = ctx.session.ticketList[ctx.session.currentTicketIndex];

        await db.ticketUpdateStatus(ticket.id, 'closed');
        ctx.reply("Обращение закрыто!",
            Markup.keyboard(['Назад']).oneTime().resize());

        return ctx.scene.reenter('TICKET_HANDLING_SCENE');
    });

    ticketHandlingScene.action('next_page', async (ctx) => {
        ctx.session.ticketOffset = ctx.session.ticketOffset + ctx.session.ticketLimit;
        await sendTicketList(ctx);
    });

    ticketHandlingScene.action('back', async (ctx) => {
        return ctx.scene.reenter('TICKET_HANDLING_SCENE');
    });

    ticketHandlingScene.action(/ticket_\d+/, async (ctx) => {
        const ticketIndex = parseInt(ctx.match[0].split('_')[1]) - 1;
        const ticket = ctx.session.ticketList[ticketIndex];

        if (ticket) {
            ctx.session.currentTicketIndex = ticketIndex;

            ctx.session.ticketData = await db.getTicketByNumberBot(ticket.ticket_number);
            let text = `Статус: ${statusValues[ticket.status]}\n\n`;

            for (const msg of ctx.session.ticketData) {
                text += `Дата обновления: ${msg.date}\n${msg.manager ? 'Ответ менеджера' : 'Вопрос пользователя'}:\n\n${msg.text}\n`
            }
            ctx.reply(text,
                Markup.inlineKeyboard([
                    [Markup.button.callback('Просмотр сообщений', 'get_chain')],
                    [Markup.button.callback('Последнее', 'get_last'), Markup.button.callback('Ответить', 'reply')],
                    [Markup.button.callback('Закрыть', 'close'), Markup.button.callback('Назад', 'back')]
                ]));
        } else {
            ctx.reply("Неверный индекс!",
                Markup.keyboard(['Выйти']).oneTime().resize());
        }
    });

    ticketHandlingScene.on('message', async (ctx) => {
        try {
            if (ctx.message.text) {
                ctx.session.messageText += ctx.message.text + '\n';
            }

            if (ctx.message.caption) {
                ctx.session.messageText += ctx.message.caption + '\n';
            }

            if (ctx.message.photo) {
                const photo = ctx.message.photo[0];
                ctx.session.photos.push(photo.file_id);
            }

            if (ctx.message.document) {
                ctx.session.files.push(ctx.message.document.file_id);
            }

            ctx.session.messageIds.push(ctx.message.message_id);

            ctx.reply("Часть ответа сохранена. Вы можете продолжать добавлять информацию или нажать 'Подтвердить'.", Markup.keyboard(['Подтвердить', 'Отмена']).oneTime().resize());
        } catch (e) {
            ctx.reply("Ошибка!");
            console.log(e.message);
            return ctx.scene.enter('MAIN_MENU_SCENE');
        }
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
            const tickets = await db.getTicketsByStatusBot(ctx.session.ticketStatus, ctx.session.ticketOffset, ctx.session.ticketLimit);

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
                keyboard.push([Markup.button.callback('Назад', 'back')]);

                ctx.reply(
                    `Список обращений:\n\n${ticketList}`,
                    Markup.inlineKeyboard(keyboard));

            } else {
                ctx.reply("Нет обращений в этой категории.");
                return ctx.scene.reenter('TICKET_HANDLING_SCENE');
            }
        } catch (e) {
            ctx.reply("Ошибка!",
                Markup.keyboard(['Назад']).oneTime().resize());
            console.log(e.message);
        }
    };

    ticketHandlingScene.leave(async (ctx) => {
        ctx.session.ticketOffset = null;
        ctx.session.ticketLimit = null;
        ctx.session.ticketList = null;
        ctx.session.ticketStatus = null;
        ctx.session.currentTicketIndex = null;
        ctx.session.ticketData = null
        ctx.session.messageText = null;
        ctx.session.files = null;
        ctx.session.photos = null;
        ctx.session.messageIds = null;
    });

    return ticketHandlingScene;
};

module.exports = createTicketHandlingScene;
