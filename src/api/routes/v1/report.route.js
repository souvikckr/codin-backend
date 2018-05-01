const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/report.controller');
const { tslint } = require('../../validations/report.validation');

const router = express.Router();

router
    .route('/tslint/:period')
    .get(validate(tslint), controller.tslint);

module.exports = router;
