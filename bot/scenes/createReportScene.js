const { Scenes } = require('telegraf');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const createReportScene = () => {
    const createReportScene = new Scenes.BaseScene('CREATE_REPORT_SCENE');

    createReportScene.enter((ctx) => {
        ctx.reply("Создание отчета, подождите...");
        generateAndSendReport(ctx);
    });

    const generateAndSendReport = async (ctx) => {
        try {
            const reportsDir = path.join(__dirname, '..', 'reports');
            if (!fs.existsSync(reportsDir)) {
                fs.mkdirSync(reportsDir);
            }

            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto('http://localhost:3000/api/report/print', { waitUntil: 'networkidle2' });

            const pdfPath = path.join(reportsDir, `report-${ctx.from.id}.pdf`);

            await page.pdf({ path: pdfPath, format: 'A4' });
            await browser.close();
            await ctx.replyWithDocument({ source: pdfPath });

            fs.unlinkSync(pdfPath);
            return ctx.scene.enter('ADMIN_MENU_SCENE');
        } catch (error) {
            console.error(error);
            ctx.reply("Произогла ошибка генерации отчета, попробуйте позже.");
            return ctx.scene.enter('ADMIN_MENU_SCENE');
        }
    };

    return createReportScene;
};

module.exports = createReportScene;