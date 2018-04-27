const { database } = require('./vars');

module.exports = (config) => {
    config.userSchemaBuilder()
        .isUniqueKeyEmail(true)
        .setUniqueKeyName('email')
        .build();


    config.repositorySchemaBuilder()
        .setRepository('mongo')
        .setUri(database.uri)
        .setDatabaseName(database.database)
        .setCollectionName(database.userCollection)
        .build();

    return config;
};
