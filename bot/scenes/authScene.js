const { Scenes } = require('telegraf');
const db = require('../../controllers/dbController');

const createAuthScene = () => {
    const authScene = new Scenes.BaseScene('AUTH_SCENE');

    authScene.enter(async (ctx) => {
        try {
            const user = await db.getUserBot(ctx.from.username);

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
};

module.exports = createAuthScene;
