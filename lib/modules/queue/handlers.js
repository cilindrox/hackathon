'use strict';

const Boom = require('boom');

const internals = {
    queueName: 'waitlist'
};


exports.push = (request, reply) => {

    const payload = JSON.stringify(request.payload);

    request.client.lpush(internals.queueName, payload, (err, res) => {

        /* $lab:coverage:off$ */
        if (err) {
            return reply(Boom.badImplementation('Error pushing element to queue', err));
        }
        /* $lab:coverage:on$ */

        request.server.log(['info', 'redis'], `LPUSH:${ res }`);
        return reply(res).code(201);
    });
};


exports.pop = (request, reply) => {

    request.client.rpop(internals.queueName, (err, res) => {

        /* $lab:coverage:off$ */
        if (err) {
            return reply(Boom.badImplementation('Error removing element from queue', err));
        }
        /* $lab:coverage:on$ */

        request.server.log(['info', 'redis'], `RPOP:${ res }`);
        return reply(internals.queue).code(200);
    });
};


exports.get = (request, reply) => {

    request.client.lrange(internals.queueName, 0, -1, (err, res) => {

        /* $lab:coverage:off$ */
        if (err) {
            return reply(Boom.badImplementation('Error fetching queue', err));
        }
        /* $lab:coverage:on$ */

        request.server.log(['info', 'redis'], `LRANGE:${ res }`);

        const result = res.map((item) => {

            return JSON.parse(item);
        });

        return reply(result);
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
