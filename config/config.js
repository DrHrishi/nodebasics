var config = {
    mongo: {
        hostname: 'localhost',
        port: '27017',
        username: '',
        password: '',
        db: 'techSpawn'
    },
};
config.mongo.url = 'mongodb://' + config.mongo.hostname + ':' + config.mongo.port + '/' + config.mongo.db;
module.exports = config;