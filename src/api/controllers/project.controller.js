const httpStatus = require('http-status');
const multer = require('../../config/multer');
const { addNewProject, addToUsersProjects } = require('../repository/mongo.repository');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Register a project
 * @public
 */
exports.register = async (req, res, next) => {
    try {
        if (req.user) {
            const project = {
                name: req.body.name,
                created_by: req.user._id,
                contributors: [req.user._id],
                meta: {
                    created_at: new Date().getTime(),
                    updated_at: 0,
                },
            };
            await addNewProject(project);
            const x = await addToUsersProjects(req.user._id, project._id);
            return res.status(httpStatus.OK).json({ message: 'registered', project, x });
        }
        return res.status(httpStatus.UNAUTHORIZED).json({ message: 'not registered' });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};


/**
 * Upload a report
 * @public
 */
exports.upload = async (req, res, next) => {
    try {
        if (req.user) {
            await multer(req, res);
            return res.status(httpStatus.OK).json({ message: 'uploaded' });
        }
        return res.status(httpStatus.UNAUTHORIZED).json({ message: 'not uploaded' });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};
