const { MongoClient, ObjectId } = require('mongodb');
const { database } = require('../../config/vars');
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
const connect = () => new Promise((resolve, reject) => {
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
            connectionIsProgress = false;// unsetting the flag
            return resolve(db);
        });
    });
    return connectionPromise;
});

const addNewProject = project => new Promise(async (resolve, reject) => {
    if (!db) {
        await connect();
    }
    db.collection(database.projectCollection)
        .insertOne(project)
        .then(resolve)
        .catch(reject);
});

const addToUsersProjects = (userID, projectID) => new Promise(async (resolve, reject) => {
    if (!db) {
        await connect();
    }
    db.collection(database.userCollection)
        .updateOne({ _id: new ObjectId(userID) }, { $addToSet: { projects: projectID } })
        .then(resolve)
        .catch(reject);
});


module.exports = {
    connect, addNewProject, addToUsersProjects,
};

// /**
//  * Takes the key and checks whether there are any users in the
//  * repository against passed key.
//  * @param {string} key
//  * @returns {Promise} A promise that will be resolved to true in case the user exists
//  */
// const exists = key => new Promise(async (resolve, reject) => {
//     // For some reason, the database connection has failed, then re-try
//     // This might lead to un-responsive system if the connection is broken
//     if (!db) {
//         await connect();
//     }
//     const repoSchema = repositorySchema.get();
//     const query = {
//         [userSchema.get().keyField.name]: key,
//     };
//     db.collection(repoSchema.collection).find(query).toArray((err, result) => {
//         if (err) return reject(err);
//         return resolve(result.length > 0);
//     });
// });

// /**
//  * Takes the user object passed and saves it to the repository
//  * @param {*} object
//  * @returns {Promise} A Promise that will be resolved to the output from repository operation
//  */
// const create = object => new Promise(async (resolve, reject) => {
//     if (!db) {
//         await connect();
//     }
//     const repoSchema = repositorySchema.get();
//     db.collection(repoSchema.collection).insertOne(object).then(resolve).catch(reject);
// });


// /**
//  * Takes the userobject with key and password field and checks for the matching entry
//  * in the repository
//  * @param {*} user
//  * @returns {Promise} A Promise that will get resolved to the output repository operation
//  */
// const find = ({ key }) => new Promise(async (resolve, reject) => {
//     if (!db) {
//         await connect();
//     }
//     const repoSchema = repositorySchema.get();
//     const query = {
//         [userSchema.get().keyField.name]: key,
//     };
//     db.collection(repoSchema.collection).findOne(query).then(resolve).catch(reject);
// });


// const update = (key, updates) => new Promise(async (resolve, reject) => {
//     if (!db) {
//         await connect();
//     }
//     const query = {
//         [userSchema.get().keyField.name]: key,
//     };
//     const set = {
//         $set: updates,
//     };
//     const repoSchema = repositorySchema.get();
//     db.collection(repoSchema.collection).updateOne(query, set).then(resolve).catch(reject);
// });

