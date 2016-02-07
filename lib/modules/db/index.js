'use strict';

const Hoek = require('hoek');
const Mongoose = require('mongoose');


exports.register = (server, options, next) => {

    const url = options.url;
    Hoek.assert(url, 'Invalid MongoDB URL provided');

    Mongoose.connect(url, options.settings);
    const db = Mongoose.connection;
    db.once('open', () => {

        server.log(['info', 'mongo'], 'connected to mongo DB');
        server.decorate('request', 'db', db);
        return next();
    });
};


exports.register.attributes = {
    name: 'db'
};
