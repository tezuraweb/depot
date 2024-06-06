require('dotenv').config()
const express = require('express');
const nunjucks = require('nunjucks');
const routes = require('./routes/index');

const app = new express();

nunjucks.configure('views', {
    autoescape: true,
    express: app,
});

app.set('view engine', 'njk');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));
app.use('/', routes);

app.listen(process.env.PORT);