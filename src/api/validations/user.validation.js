const Joi = require('joi');

module.exports = {
    // GET /v1/user/suggestions
    suggestions: {
        params: {
            query: Joi.string().min(2).required(),
        },
    },

    // POST /v1/user/signup
    // Only name is required,
    // Email, passwoed, confirm is taken care by manage-users
    signup: {
        body: Joi.object().keys({
            name: Joi.string().required(),
        }).unknown(true),
    },
};
