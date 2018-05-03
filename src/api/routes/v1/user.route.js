const express = require('express');
const validate = require('express-validation');
const { routes } = require('manage-users');

const { suggestions, signup } = require('../../validations/user.validation');
const controller = require('../../controllers/user.controller');

const router = express.Router();

router
    .route('/signup')
    .post(validate(signup), routes.signup());

router
    .route('/login')
    .post(routes.login(), controller.login);

router.route('/logout')
    .all(controller.logout);

router.route('/project')
    .get(controller.project);

router.route('/suggestions/:query')
    .get(validate(suggestions), controller.suggestions);

router.route('/me')
    .get(controller.me);

module.exports = router;
