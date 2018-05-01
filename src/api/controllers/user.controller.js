const httpStatus = require('http-status');

const {
    getUsersProjects,
} = require('../repository/mongo.repository');
const { handler: errorHandler } = require('../middlewares/error');


/**
 * Gets the list of the projects of user
 * @public
 */
exports.project = async (req, res, next) => {
    try {
        if (req.user) {
            const projects = await getUsersProjects(req.user._id);
            return res.status(httpStatus.OK).json(projects);
        }
        return res.status(httpStatus.UNAUTHORIZED).json({ message: 'UNAUTHORIZED' });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};
