const { MongoClient, ObjectId } = require("mongodb");
const { database } = require("../../config/vars");
// Holds the current connection to repository
let db = null;

// Whether any connection opening process in ongoing
// Helps keep track of opening only single connection to database
let connectionIsProgress = false;
let connectionPromise = null;

/**
 * Opens the connection to database and saves the conneciton in 'db' variable.
 * @returns {Promise} A promise that will be resolved to the database connection if successful
 */
const connect = () =>
    new Promise((resolve, reject) => {
        // Check if another promise is pending.
        if (connectionIsProgress) {
            // Yes there is, just return the previous promise
            return connectionPromise;
        }
        // No there is no promise pending. Let us create a new one
        connectionIsProgress = true; // setting the flag
        connectionPromise = new Promise(() => {
            MongoClient.connect(database.uri, (err, client) => {
                if (err) {
                    connectionIsProgress = false; // unsetting the flag
                    return reject(err);
                }
                db = client.db(database.database);
                connectionIsProgress = false; // unsetting the flag
                return resolve(db);
            });
        });
        return connectionPromise;
    });

const addNewProject = project =>
    new Promise(async (resolve, reject) => {
        if (!db) {
            await connect();
        }
        db
            .collection(database.projectCollection)
            .insertOne(project)
            .then(resolve)
            .catch(reject);
    });

const addToUsersProjects = (userID, projectID, role) =>
    new Promise(async (resolve, reject) => {
        if (!db) {
            await connect();
        }
        const projectData = {};
        db
            .collection(database.projectCollection)
            .find({ _id: new ObjectId(projectID) })
            .toArray()
            .then(value => {
                projectData["name"] = value[0].name;
                projectData["id"] = value[0]._id;
                projectData["role"] = role;
                const update = {
                    $addToSet: { projects: projectData }
                };
                db
                    .collection(database.userCollection)
                    .updateOne({ _id: new ObjectId(userID) }, update)
                    .then(resolve)
                    .catch(reject);
            });
    });

const addToProjectsContributor = (projectID, contributorID) =>
    new Promise(async (resolve, reject) => {
        if (!db) {
            await connect();
        }
        const contributor = {};
        db
            .collection(database.userCollection)
            .find({ _id: new ObjectId(contributorID) })
            .toArray()
            .then(value => {
                contributor["name"] = value[0].name;
                contributor["email"] = value[0].email;
                contributor["id"] = new ObjectId(contributorID);
                const update = {
                    $addToSet: { contributors: contributor }
                };
                db
                    .collection(database.projectCollection)
                    .updateOne({ _id: new ObjectId(projectID) }, update)
                    .then(resolve)
                    .catch(reject);
            });
    });

const isUserAContributor = (userID, projectID) =>
    new Promise(async (resolve, reject) => {
        if (!db) {
            await connect();
        }
        db
            .collection(database.userCollection)
            .findOne({
                _id: new ObjectId(userID),
                "projects.id": { $eq: new ObjectId(projectID) }
            })
            .then(resolve)
            .catch(reject);
    });

const addReportToProject = (projectID, json) =>
    new Promise(async (resolve, reject) => {
        if (!db) {
            await connect();
        }
        db
            .collection(database.projectCollection)
            .updateOne(
                { _id: new ObjectId(projectID) },
                { $addToSet: { reports: json } }
            )
            .then(resolve)
            .catch(reject);
    });

const getUsersProjects = userID =>
    new Promise(async (resolve, reject) => {
        if (!db) {
            await connect();
        }
        db
            .collection(database.userCollection)
            .find({ _id: new ObjectId(userID) })
            .project({ projects: 1, _id: 0 })
            .toArray()
            .then(data => resolve(data[0]))
            .catch(reject);
    });

const getUserSuggestions = query =>
    new Promise(async (resolve, reject) => {
        if (!db) {
            await connect();
        }
        db
            .collection(database.userCollection)
            .find({ email: { $regex: `${query}.*@.*` } })
            .project({ name: 1, email: 1 })
            .toArray()
            .then(resolve)
            .catch(reject);
    });

const getContributorsInfo = projectID =>
    new Promise(async (resolve, reject) => {
        if (!db) {
            await connect();
        }
        db
            .collection(database.projectCollection)
            .find({ _id: new ObjectId(projectID) })
            .project({ contributors: 1, _id: 0})
            .toArray()
            .then(data => resolve(data[0]))
            .catch(reject);
    });

module.exports = {
    connect,
    addNewProject,
    addToUsersProjects,
    isUserAContributor,
    addReportToProject,
    getUsersProjects,
    addToProjectsContributor,
    getUserSuggestions,
    getContributorsInfo
};
