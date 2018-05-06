const express = require('express');
const validate = require('express-validation');
const { routes } = require('manage-users');

const { suggestions, signup } = require('../../validations/user.validation');
const controller = require('../../controllers/user.controller');
const authenticated = require('../../middlewares/authenticated');

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
    .get(authenticated, controller.project);

router.route('/suggestions/:query')
    .get(validate(suggestions), authenticated, controller.suggestions);

router.route('/me')
    .get(authenticated, controller.me);

module.exports = router;
