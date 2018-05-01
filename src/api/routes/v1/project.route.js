const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/project.controller');
const { upload, register, contributor } = require('../../validations/project.validation');

const router = express.Router();

router
    .route('/upload/:projectID')
    .post(validate(upload), controller.upload);

router
    .route('/register')
    .post(validate(register), controller.register);

router
    .route('/contributor')
    .post(validate(contributor), controller.contributor);

module.exports = router;
