const { Scenes, Markup } = require('telegraf');
const db = require('../../controllers/dbController');

const createTicketScene = () => {
    const createTicketScene = new Scenes.BaseScene('CREATE_TICKET_SCENE');

    createTicketScene.enter((ctx) => {
        ctx.session.ticket = {
            text: '',
            files: [],
            photos: [],
            messages: []
        };
        ctx.reply("Опишите ваше обращение. Вы также можете прикрепить файлы. Когда закончите, нажмите 'Подтвердить'.", 
            Markup.keyboard(['Назад']).oneTime().resize());
    });

    createTicketScene.hears("Назад", (ctx) => {
        return ctx.scene.enter('MAIN_MENU_SCENE');
    });

    createTicketScene.hears("Подтвердить", async (ctx) => {
        try {
            const ticket = await db.insertTicketBot({
                inquirer: ctx.from.id,
                text: ctx.session.ticket.text,
                files: ctx.session.ticket.files,
                photos: ctx.session.ticket.photos,
                messages: ctx.session.ticket.messages,
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
                const photo = ctx.message.photo[0];
                ctx.session.ticket.photos.push(photo.file_id);
            }

            if (ctx.message.document) {
                ctx.session.ticket.files.push(ctx.message.document.file_id);
            }

            ctx.session.ticket.messages.push(ctx.message.message_id);

            ctx.reply("Часть обращения сохранена. Вы можете продолжать добавлять информацию или нажать 'Подтвердить'.", Markup.keyboard(['Подтвердить', 'Назад']).oneTime().resize());
        } catch (e) {
            ctx.reply("Ошибка!");
            console.log(e.message);
            return ctx.scene.enter('MAIN_MENU_SCENE');
        }
    });

    createTicketScene.leave(async (ctx) => {
        ctx.session.ticket = null;
    });

    return createTicketScene;
};

module.exports = createTicketScene;
