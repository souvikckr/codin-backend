const path = require('path');

// import .env variables
require('dotenv-safe').load({
    path: path.join(__dirname, '../../.env'),
});

module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
    uploads: {
        path: 'uploads',
        incoming: 'report',
    },
    session: {
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    },
    database: {
        uri: process.env.DB_URI,
        database: process.env.DB_DB_NAME,
        userCollection: process.env.DB_USER_COLLECTION,
        projectCollection: process.env.DB_PROJECT_COLLECTION,
    },
};
