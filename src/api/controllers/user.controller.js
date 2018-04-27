const httpStatus = require('http-status');


const { handler: errorHandler } = require('../middlewares/error');

/**
 * Upload a report
 * @public
 */
exports.upload = (req, res, next) => {
    try {
        return res.status(httpStatus.OK).json({ message: 'uploaded' });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};
