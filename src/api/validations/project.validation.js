const Joi = require('joi');

module.exports = {
    // POST /v1/project/upload
    upload: {
        body: {
            userID: Joi.string().required(),
            projectID: Joi.string().required(),
            password: Joi.string().min(6).required(),
        },
    },

    // POST /v1/project/register
    register: {
        body: {
            name: Joi.string().required(),
        },
    },
};
