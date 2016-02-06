'use strict';

const Routes = require('./routes');

exports.register = (server, options, next) => {

    server.route(Routes);
    server.decorate('request', 'client', server.app.redis);

    return next();
};


exports.register.attributes = {
    name: 'queue',
    dependencies: ['hapi-ioredis']
};
