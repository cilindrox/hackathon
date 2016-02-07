'use strict';

const Boom = require('boom');
const Client = require('../db/model');

const internals = {
    maxRecords: 50
};


exports.add = (request, reply) => {

    const payload = request.payload;

    return Client.create(payload, (err, saved) => {

        /* $lab:coverage:off$ */
        if (err) {
            return reply(Boom.badImplementation('Error inserting element', err));
        }
        /* $lab:coverage:on$ */

        reply(saved);
    });
};


exports.remove = (request, reply) => {

    const id = request.params.id;

    Client.remove({ _id: id }, (err, res) => {

        /* $lab:coverage:off$ */
        if (err) {
            return reply(Boom.badImplementation('Error removing element', err));
        }
        /* $lab:coverage:on$ */

        return reply(res);
    });
};


exports.list = (request, reply) => {

    Client
        .find({ })
        .lean()
        .limit(internals.maxRecords)
        .exec((err, list) => {

            /* $lab:coverage:off$ */
            if (err) {
                return reply(Boom.badImplementation('Error fetching queue', err));
            }
            /* $lab:coverage:on$ */

            return reply(list);
        });
};


exports.sendSms = (request, reply) => {

    const payload = {
        to: request.payload.phone,
        from: process.env.TWILIO_FROM_NUM,
        body: 'You have been added to the waitlist. Text \'9\' if you need to cancel.'
    };

    request.twilio.sendMessage(payload, (err, responseData) => {

        /* $lab:coverage:off$ */
        if (err) {
            request.server.log(['error', 'sms'], err);
            return reply(Boom.badImplementation('Error sending SMS', err));
        }
        /* $lab:coverage:on$ */

        request.server.log(['info', 'sms'], responseData);
        return reply(responseData);
    });
};
