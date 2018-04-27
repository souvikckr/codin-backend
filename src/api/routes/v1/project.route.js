const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/project.controller');
const { register } = require('../../validations/project.validation');

const router = express.Router();

router
    .route('/upload')
    .post(controller.upload);

router
    .route('/register')
    .post(validate(register), controller.register);

module.exports = router;
