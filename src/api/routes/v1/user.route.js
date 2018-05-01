const express = require('express');
const { routes } = require('manage-users');

const controller = require('../../controllers/user.controller');

const router = express.Router();

router
    .route('/signup')
    .post(routes.signup());

router
    .route('/login')
    .post(routes.login(), (req, res, next) => {
        res.json(req.user);
    });

router.route('/project')
    .get(controller.project);

module.exports = router;
