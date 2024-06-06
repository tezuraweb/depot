const express = require('express');
const pick = require('lodash/pick');

const router = express.Router();

router
    .route('/lead')
    .post(async (req, res) => {
        res
            .header('Location', `${req.protocol}://${req.hostname}`)
            .sendStatus(201);
    });

module.exports = router;