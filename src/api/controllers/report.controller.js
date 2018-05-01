const httpStatus = require('http-status');
const { handler: errorHandler } = require('../middlewares/error');

// TODO: Finish this controller
const getReportByRule = (user, period) => {

};

const getReportByFile = (user, period) => {

};


/**
 * Upload a report
 * @public
 */
exports.tslint = (req, res, next) => {
    try {
        if (req.user) {
            const { period } = req.params;
            const { sort } = req.query;

            // switch (sort) {
            //     case 'rule':
            //         getReportByRule(req.user, period);
            //         break;
            //     case 'file':
            //         getReportByFile(req.user, period);
            //         break;
            //     default:
            //         return res.status(httpStatus.BAD_REQUEST).send({ message: `sort type '${sort}' is not implemented yet` });
            // }

            return res.status(httpStatus.BAD_REQUEST).send({ message: `sort type '${sort}' is not implemented yet` });
        }
        return res.status(httpStatus.UNAUTHORIZED).json({ message: 'UNAUTHORIZED' });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};
