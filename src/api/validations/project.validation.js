const Joi = require('joi');

module.exports = {
    // POST /v1/project/upload
    upload: {
        params: {
            projectID: Joi.string().required(),
        },
    },

    // POST /v1/project/register
    register: {
        body: {
            name: Joi.string().required(),
        },
    },

    // POST /v1/project/contributor
    contributor: {
        body: {
            contributorID: Joi.string().required(),
            projectID: Joi.string().required(),
        },
    },
};
