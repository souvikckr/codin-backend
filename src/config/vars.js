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
        secret: 'q1W@e3R$t5',
        resave: false,
        saveUninitialized: true,
    },
    database: {
        uri: 'mongodb://localhost:27017/codin_local',
        database: 'codin_local',
        userCollection: 'user',
        projectCollection: 'project',
    },
};
