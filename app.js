require('dotenv').config()
const express = require('express');
const cors = require('cors');
const nunjucks = require('nunjucks');
const routes = require('./routes/index');

const app = new express();

nunjucks.configure('views', {
    autoescape: true,
    express: app,
});

app.set('view engine', 'njk');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));
app.use('/', routes);

app.listen(process.env.PORT);