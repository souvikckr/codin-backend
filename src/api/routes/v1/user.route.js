const express = require('express');
const { routes } = require('usermanagement');

const router = express.Router();

router
    .route('/signup')
    .post(routes.signup());

router
    .route('/login')
    .post(routes.login(), (req, res, next) => {
        res.json(req.user);
    });

module.exports = router;
