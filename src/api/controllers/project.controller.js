const httpStatus = require("http-status");
const zlib = require("zlib");
const fs = require("fs");
const { ObjectId } = require("mongodb");
const path = require("path");
const { role } = require("../../config/vars");
const logger = require("../utils/logger");
const multer = require("../../config/multer");
const {
    addNewProject,
    addToUsersProjects,
    isUserAContributor,
    addReportToProject,
    addToProjectsContributor,
    getContributorsInfo
} = require("../repository/mongo.repository");
const { handler: errorHandler } = require("../middlewares/error");

/**
 * Register a project
 * @public
 */
exports.register = async (req, res, next) => {
    try {
        const project = {
            name: req.body.name,
            created_by: new ObjectId(req.user._id),
            contributors: [new ObjectId(req.user._id)],
            role: role.admin,
            meta: {
                created_at: new Date().getTime(),
                updated_at: 0
            }
        };
        await addNewProject(project);
        // When the project is added successfully,
        // It will have _id field in the object
        await addToUsersProjects(req.user._id, project._id, role.admin);
        return res
            .status(httpStatus.OK)
            .json({ message: "REGISTERED", project });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

const unlink = file =>
    new Promise(resolve => {
        fs.unlink(file.path, err => {
            if (err) {
                logger.error(
                    `Failed to delete '${path.basename(
                        file.path
                    )}'. ${JSON.stringify(err)}`
                );
            } else {
                logger.info(`Deleted '${path.basename(file.path)}'.`);
            }
            resolve();
        });
    });

const decompress = file =>
    new Promise((resolve, reject) => {
        const stream = fs.createReadStream(file.path);
        const unzip = zlib.createGunzip();
        stream.pipe(unzip);
        let x = "";
        unzip.on("data", chunk => {
            x += chunk;
        });
        unzip.on("finish", () => {
            resolve(JSON.parse(x));
        });
        unzip.on("error", err => {
            reject(err);
        });
    });

/**
 * Upload a report
 * @public
 */
exports.upload = async (req, res, next) => {
    try {
        const { projectID } = req.params;
        const isUserAllowed = await isUserAContributor(req.user._id, projectID);
        if (isUserAllowed) {
            const file = await multer(req, res);
            const json = await decompress(file);
            const report = {
                meta: {
                    submitted_by: req.user._id,
                    submitted_at: new Date().getTime()
                },
                report: json
            };
            await addReportToProject(projectID, report);
            res.status(httpStatus.OK).json({ message: "UPLOADED" });
            return unlink(file);
        }
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "NOT A CONTRIBUTOR"
        });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

/**
 * Upload a report
 * @public
 */
exports.contributor = async (req, res, next) => {
    try {
        const { contributorID } = req.body;
        const { projectID } = req.body;
        // const isUserAllowed = await isUserAContributor(req.user._id, projectID);
        // if (isUserAllowed) {
        await addToUsersProjects(contributorID, projectID, role.contributor);
        await addToProjectsContributor(projectID, contributorID);
        return res.status(httpStatus.OK).json({
            message: "SUCCESS"
        });
        // }
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "NOT A CONTRIBUTOR"
        });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

/**
 * Upload a report
 * @public
 */
exports.getContributors = async (req, res, next) => {
    try {
        console.log("request -----", req.params.projectID);
        if (req.params.projectID) {
            const projects = await getContributorsInfo(req.params.projectID);
            return res.status(httpStatus.OK).json(projects);
        }
        return res
            .status(httpStatus.UNAUTHORIZED)
            .json({ message: "UNAUTHORIZED" });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};
