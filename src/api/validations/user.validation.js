const Joi = require('joi');

module.exports = {
    // GET /v1/user/suggestions
    suggestions: {
        params: {
            query: Joi.string().min(2).required(),
        },
    },
};
