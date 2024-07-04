const { Scenes, Markup } = require('telegraf');
const db = require('../../controllers/dbController');

const createTicketScene = () => {
    const createTicketScene = new Scenes.BaseScene('CREATE_TICKET_SCENE');

    createTicketScene.enter((ctx) => {
        ctx.session.ticket = {
            text: '',
            attachments: []
        };
        ctx.reply("Опишите ваше обращение. Вы также можете прикрепить файлы. Когда закончите, нажмите 'Подтвердить'.", 
            Markup.keyboard(['Назад']).oneTime().resize());
    });

    createTicketScene.hears("Назад", (ctx) => {
        ctx.session.ticket = null;
        return ctx.scene.enter('MAIN_MENU_SCENE');
    });

    createTicketScene.hears("Подтвердить", async (ctx) => {
        try {
            const ticket = await db.insertTicketBot({
                tg_id: ctx.from.id,
                text: ctx.session.ticket.text,
                files: ctx.session.ticket.attachments,
                message_id: ctx.message.message_id,
                isNew: true,
            });

            ctx.reply("Ваше обращение зарегистрировано!");
            ctx.session.ticket = null;
            return ctx.scene.enter('MAIN_MENU_SCENE');
        } catch (e) {
            ctx.reply("Ошибка!");
            console.log(e.message);
            return ctx.scene.reenter();
        }
    });

    createTicketScene.on("message", async (ctx) => {
        try {
            if (ctx.message.text) {
                ctx.session.ticket.text += ctx.message.text + '\n';
            }

            if (ctx.message.caption) {
                ctx.session.ticket.text += ctx.message.caption + '\n';
            }

            if (ctx.message.photo) {
                for (const photo of ctx.message.photo) {
                    const fileLink = await ctx.telegram.getFileLink(photo.file_id);
                    ctx.session.ticket.attachments.push(fileLink.href);
                }
            }

            if (ctx.message.document) {
                const fileLink = await ctx.telegram.getFileLink(ctx.message.document.file_id);
                ctx.session.ticket.attachments.push(fileLink.href);
            }

            ctx.reply("Часть обращения сохранена. Вы можете продолжать добавлять информацию или нажать 'Подтвердить'.", Markup.keyboard(['Подтвердить', 'Назад']).oneTime().resize());
        } catch (e) {
            ctx.reply("Ошибка!");
            console.log(e.message);
            return ctx.scene.enter('MAIN_MENU_SCENE');
        }
    });

    return createTicketScene;
};

module.exports = createTicketScene;
