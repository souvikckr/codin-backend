const httpStatus = require('http-status');

const {
    getUsersProjects,
    getUserSuggestions,
} = require('../repository/mongo.repository');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Called AFTER the successful login of the user
 */
exports.login = (req, res, next) => {
    const user = Object.assign({}, req.user);
    // Might want to remove some fields off the user.
    res.json(user);
};

/**
 * Used to clears session and req.user object using passport's req.logout()
 */
exports.logout = (req, res, next) => {
    // Passport adds a method logout to the req object.
    // Which will clear session as well as req.user object
    req.logout();
    res.status(httpStatus.OK).json({ message: 'LOGGED_OUT' });
};

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


/**
 * Gets the suggestions list for given email
 * @public
 */
exports.suggestions = async (req, res, next) => {
    try {
        if (req.user) {
            const { query } = req.params;
            const suggestions = await getUserSuggestions(query);
            return res.status(httpStatus.OK).json({ suggestions });
        }
        return res.status(httpStatus.UNAUTHORIZED).json({ message: 'UNAUTHORIZED' });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};
