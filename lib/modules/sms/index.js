'use strict';

const Hoek = require('hoek');
const Twilio = require('twilio');

const internals = {};


exports.register = (server, options, next) => {

    Hoek.assert(options.acctSid, 'Missing Twilio Account SID');
    Hoek.assert(options.authToken, 'Missing Twilio Auth Token');

    const client = Twilio(options.acctSid, options.authToken);
    server.app.client = client;
    server.decorate('request', 'twilio', client);
    server.log(['info', 'sms'], 'Twilio client registered');

    return next();
};


exports.register.attributes = {
    name: 'sms'
};
