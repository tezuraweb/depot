const { Scenes, Markup } = require('telegraf');
const db = require('../../controllers/dbController');

const createTicketScene = () => {
    const scene = new Scenes.BaseScene('CREATE_TICKET_SCENE');

    scene.enter(async (ctx) => {
        ctx.session.ticket = {
            text: '',
            files: [],
            photos: [],
            isNew: !ctx.session.newTicketId
        };

        await ctx.reply(
            "Введите сообщение. Вы также можете прикрепить файлы. Когда закончите, нажмите 'Подтвердить'.",
            Markup.keyboard(['Подтвердить', 'Назад']).oneTime().resize()
        );
    });

    scene.hears('Назад', async (ctx) => {
        const targetScene = ctx.session.user.status === 'admin'
            ? 'ADMIN_MENU_SCENE'
            : 'MAIN_MENU_SCENE';
        return ctx.scene.enter(targetScene);
    });

    scene.hears('Подтвердить', async (ctx) => {
        try {
            const ticketData = prepareTicketData(ctx);

            // Insert ticket
            if (ctx.session.ticket.isNew || !ticketData.id) {
                await db.insertTicketBot(ticketData);
            } else {
                await db.insertTicketMessageBot(ticketData);
            }

            // Send notification to user if it's a reply
            if (ticketData.id) {
                const notificationRecipient = (!ctx.session.newTicketInquirer || ctx.from.id === ctx.session.newTicketInquirer)
                    ? ctx.session.newTicketManager
                    : ctx.session.newTicketInquirer;

                if (notificationRecipient) {
                    await sendNotificationToUser(ctx, notificationRecipient);
                }
            } else {
                const managers = await db.getTenantManagers(ctx.session.user.organization);

                try {
                    managers.forEach(async (manager) => {
                        await ctx.telegram.sendMessage(
                            manager.tg_id,
                            `Новое обращение от @${ctx.from.username}:\n\n${ctx.session.ticket.text}`
                        );
                    });
                } catch (error) {
                    console.error('Manager notification error:', error);
                }
            }

            await handleSuccess(ctx);
        } catch (error) {
            console.error('Confirm error:', error);
            await ctx.reply("Ошибка при создании обращения!");
            return ctx.scene.reenter();
        }
    });

    scene.on('message', async (ctx) => {
        try {
            if (ctx.message.text && !['Подтвердить', 'Назад'].includes(ctx.message.text)) {
                ctx.session.ticket.text += ctx.message.text + '\n';
            }

            if (ctx.message.caption) {
                ctx.session.ticket.text += ctx.message.caption + '\n';
            }

            if (ctx.message.photo) {
                ctx.session.ticket.photos.push(ctx.message.photo[0].file_id);
            }

            if (ctx.message.document) {
                ctx.session.ticket.files.push(ctx.message.document.file_id);
            }

            await ctx.reply(
                "Часть обращения сохранена. Вы можете продолжать добавлять информацию или нажать 'Подтвердить'.",
                Markup.keyboard(['Подтвердить', 'Назад']).oneTime().resize()
            );
        } catch (error) {
            console.error('Message handling error:', error);
            await ctx.reply("Ошибка при сохранении сообщения!");
            return ctx.scene.reenter();
        }
    });

    scene.leave(async (ctx) => {
        // Clean up session data
        ctx.session.newTicketId = null;
        ctx.session.newTicketInquirer = null;
        ctx.session.newTicketInquirerUsername = null;
        ctx.session.newTicketManager = null;
        ctx.session.ticket = null;
    });

    // Helper functions
    function prepareTicketData(ctx) {
        const ticketData = { ...ctx.session.ticket };

        if (ctx.session.newTicketInquirer) {
            ticketData.inquirer = ctx.session.newTicketInquirer;
            ticketData.manager = ctx.from.id;
            ticketData.reply = 1;
        } else {
            ticketData.inquirer = ctx.from.id;
        }

        if (ctx.session.newTicketId) {
            ticketData.id = ctx.session.newTicketId;
            ticketData.isNew = false;
        }

        ticketData.inquirer_username = ctx.session.newTicketInquirerUsername || ctx.from.username;

        return ticketData;
    }

    async function sendNotificationToUser(ctx, recipientId) {
        try {
            const msgText = ctx.session.newTicketManager ?
                `Получено новое сообщение от @${ctx.from.username}:\n\n${ctx.session.ticket.text}` :
                `Ответ на ваше обращение:\n\n${ctx.session.ticket.text}`;

            await ctx.telegram.sendMessage(
                recipientId,
                msgText
            );

            for (const photoUrl of ctx.session.ticket.photos) {
                await ctx.telegram.sendPhoto(recipientId, photoUrl);
            }

            for (const fileId of ctx.session.ticket.files) {
                await ctx.telegram.sendDocument(recipientId, fileId);
            }
        } catch (error) {
            console.error('Notification error:', error);
        }
    }

    async function handleSuccess(ctx) {
        const message = ctx.session.user.status === 'admin'
            ? "Ваш ответ записан!"
            : "Ваше обращение зарегистрировано!";

        await ctx.reply(message);

        const targetScene = ctx.session.user.status === 'admin'
            ? 'ADMIN_MENU_SCENE'
            : 'MAIN_MENU_SCENE';

        return ctx.scene.enter(targetScene);
    }

    return scene;
};

module.exports = createTicketScene;