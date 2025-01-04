const { Scenes, Markup } = require('telegraf');
const db = require('../../controllers/dbController');

const STATUS_LABELS = {
    new: 'новое',
    in_process: 'в процессе',
    closed: 'закрыто',
};

const createTicketHistoryScene = () => {
    const scene = new Scenes.BaseScene('TICKET_HISTORY_SCENE');

    scene.enter(async (ctx) => {
        try {
            initializeSession(ctx);

            if (ctx.session.user.status === 'admin') {
                return ctx.reply(
                    "Выберите категорию обращений:",
                    Markup.keyboard(['Новые обращения', 'В процессе', 'Выйти'])
                        .oneTime()
                        .resize()
                );
            }

            await sendTicketList(ctx, 0);
        } catch (error) {
            console.error('Enter scene error:', error);
            await handleError(ctx);
        }
    });

    // Basic commands
    scene.hears('Выйти', (ctx) => {
        return ctx.scene.enter(ctx.session.user.status === 'admin' ? 'ADMIN_MENU_SCENE' : 'MAIN_MENU_SCENE');
    });

    scene.hears('Новые обращения', async (ctx) => {
        if (ctx.session.user.status !== 'admin') return;
        ctx.session.ticketStatus = 'new';
        await sendTicketList(ctx, 0);
    });

    scene.hears('В процессе', async (ctx) => {
        if (ctx.session.user.status !== 'admin') return;
        ctx.session.ticketStatus = 'in_process';
        await sendTicketList(ctx, 0);
    });

    // Pagination actions
    scene.action('next_page', async (ctx) => {
        ctx.session.ticketOffset += ctx.session.ticketLimit;
        await sendTicketList(ctx);
    });

    // Ticket viewing actions
    scene.action(/ticket_\d+/, async (ctx) => {
        try {
            const ticketIndex = parseInt(ctx.match[0].split('_')[1]) - 1;
            const ticket = ctx.session.ticketList[ticketIndex];

            if (!ticket) {
                return ctx.reply("Неверный индекс!",
                    Markup.keyboard(['Выйти']).oneTime().resize()
                );
            }

            ctx.session.currentTicketIndex = ticketIndex;
            ctx.session.ticketData = await db.getTicketByIdBot(ticket.id);

            const text = formatTicketChain(ticket, ctx.session.ticketData);
            const keyboard = getTicketActionButtons();

            await ctx.reply(text, keyboard);
        } catch (error) {
            console.error('View ticket error:', error);
            await handleError(ctx);
        }
    });

    // Message chain navigation
    scene.action('get_chain', async (ctx) => {
        ctx.session.msgIndex = 0;
        await showMessage(ctx);
    });

    scene.action('next_msg', async (ctx) => {
        ctx.session.msgIndex++;
        await showMessage(ctx);
    });

    scene.action('get_last', async (ctx) => {
        ctx.session.msgIndex = ctx.session.ticketData.length - 1;
        await showMessage(ctx);
    });

    // Ticket management
    scene.action('reply', async (ctx) => {
        try {
            const ticket = ctx.session.ticketList[ctx.session.currentTicketIndex];

            // Setup context for reply
            ctx.session.newTicketId = ticket.id;

            if (ctx.session.user.status === 'admin') {
                ctx.session.newTicketInquirer = ticket.inquirer;
                ctx.session.newTicketInquirerUsername = ticket.inquirer_username;
            } else {
                if (ticket.manager) {
                    ctx.session.newTicketManager = ticket.manager;
                }
            }

            return ctx.scene.enter('CREATE_TICKET_SCENE');
        } catch (error) {
            console.error('Reply setup error:', error);
            await handleError(ctx);
        }
    });

    scene.action('close', async (ctx) => {
        try {
            const ticket = ctx.session.ticketList[ctx.session.currentTicketIndex];

            await db.updateTicketBot(
                ticket.id,
                {
                    status: 'closed'
                }
            );

            await ctx.reply("Обращение закрыто!",
                Markup.keyboard(['Назад']).oneTime().resize()
            );

            return ctx.scene.reenter();
        } catch (error) {
            console.error('Close ticket error:', error);
            await handleError(ctx);
        }
    });

    scene.action('back', (ctx) => {
        return ctx.scene.enter(ctx.session.user.status === 'admin' ? 'ADMIN_MENU_SCENE' : 'MAIN_MENU_SCENE');
    });

    // Cleanup on scene exit
    scene.leave((ctx) => {
        ctx.session.ticketOffset = null;
        ctx.session.ticketLimit = null;
        ctx.session.ticketList = null;
        ctx.session.ticketStatus = null;
        ctx.session.currentTicketIndex = null;
        ctx.session.ticketData = null;
        ctx.session.msgIndex = null;
    });

    // Helper functions
    function initializeSession(ctx) {
        ctx.session.ticketList = [];
        ctx.session.ticketOffset = 0;
        ctx.session.ticketLimit = 9;
        ctx.session.ticketStatus = null;
        ctx.session.currentTicketIndex = null;
        ctx.session.ticketData = null;
        ctx.session.msgIndex = null;
    }

    async function sendTicketList(ctx) {
        try {
            let tickets = [];

            if (ctx.session.user.status === 'admin' && ctx.session.ticketStatus) {
                tickets = await db.getTicketsByStatusBot(
                    ctx.session.ticketStatus,
                    ctx.session.ticketOffset,
                    ctx.session.ticketLimit,
                    ctx.session.user.organization
                );
            } else {
                tickets = await db.getTicketsByUserBot(
                    ctx.from.id,
                    ctx.session.ticketOffset,
                    ctx.session.ticketLimit
                );
            }

            if (!tickets?.length) {
                const message = ctx.session.user.status === 'admin' && ctx.session.ticketStatus
                    ? "Нет обращений в этой категории."
                    : "У вас нет обращений.";

                await ctx.reply(message,
                    Markup.inlineKeyboard([Markup.button.callback('Выйти', 'back')])
                );

                return;
            }

            ctx.session.ticketList = ctx.session.ticketList.concat(tickets);
            const ticketListText = formatTicketList(tickets, ctx.session.ticketOffset);
            const keyboard = buildTicketListKeyboard(ctx, tickets, ctx.session.ticketOffset);

            await ctx.reply(ticketListText, keyboard);
        } catch (error) {
            console.error('Send ticket list error:', error);
            await handleError(ctx);
        }
    }

    function formatTicketList(tickets, offset) {
        return tickets
            .map((ticket, index) => {
                const header = ticket.username
                    ? `От ${ticket.username} (@${ticket.inquirer_username})\n`
                    : '';
                return `${index + 1 + offset}. ${header}${ticket.date}\n${ticket.text.slice(0, 30)}...`;
            })
            .join('\n\n');
    }

    function buildTicketListKeyboard(ctx, tickets, offset) {
        const buttons = tickets.map((_, index) =>
            Markup.button.callback(`${index + 1 + offset}`, `ticket_${index + 1 + offset}`)
        );

        const keyboard = [];
        for (let i = 0; i < buttons.length; i += 3) {
            keyboard.push(buttons.slice(i, i + 3));
        }

        if (tickets.length === ctx.session.ticketLimit) {
            keyboard.push([Markup.button.callback('Дальше', 'next_page')]);
        }
        keyboard.push([Markup.button.callback('Выйти', 'back')]);

        return Markup.inlineKeyboard(keyboard);
    }

    function formatTicketChain(ticket, messages) {
        let text = `Статус: ${STATUS_LABELS[ticket.status]}\n\n`;

        for (const msg of messages) {
            const sender = msg.manager
                ? '📩 Ответ менеджера'
                : `Вопрос ${ticket.inquirer_username}`;

            text += `Дата обновления: ${msg.date}\n${sender}:\n\n${msg.text}\n--------------\n\n`;
        }

        return text;
    }

    function getTicketActionButtons() {
        return Markup.inlineKeyboard([
            [Markup.button.callback('Просмотр сообщений', 'get_chain')],
            [
                Markup.button.callback('Последнее', 'get_last'),
                Markup.button.callback('Ответить', 'reply')
            ],
            [
                Markup.button.callback('Закрыть', 'close'),
                Markup.button.callback('Назад', 'back')
            ]
        ]);
    }

    async function showMessage(ctx) {
        try {
            const message = ctx.session.ticketData[ctx.session.msgIndex];
            const isLastMessage = ctx.session.msgIndex === ctx.session.ticketData.length - 1;

            const keyboard = Markup.inlineKeyboard([
                [Markup.button.callback('Написать ответ', 'reply')],
                [Markup.button.callback('Назад', 'back')].concat(
                    isLastMessage ? [] : [Markup.button.callback('Дальше', 'next_msg')]
                )
            ]);

            await ctx.reply(
                `Дата обновления: ${message.date}\n\n${message.text}`,
                keyboard
            );

            if (message.photos?.length) {
                for (const photoUrl of message.photos) {
                    await ctx.telegram.sendPhoto(ctx.chat.id, photoUrl);
                }
            }

            if (message.files?.length) {
                for (const fileId of message.files) {
                    await ctx.telegram.sendDocument(ctx.chat.id, fileId);
                }
            }
        } catch (error) {
            console.error('Show message error:', error);
            await handleError(ctx, "Ошибка при отображении сообщения!");
        }
    }

    async function handleError(ctx, message = 'Произошла ошибка! Попробуйте позже.') {
        await ctx.reply(
            message,
            Markup.keyboard(['Выйти']).oneTime().resize()
        );
    }

    return scene;
};

module.exports = createTicketHistoryScene;