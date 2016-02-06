'use strict';


exports.register = (server, options, next) => {

    server.route({
        method: 'GET',
        path: '/',
        config: {
            auth: false,
            handler: (request, reply) => {

                return reply({ ver: process.env.npm_package_version });
            }
        }
    });

    return next();
};


exports.register.attributes = {
    name: 'info'
};
