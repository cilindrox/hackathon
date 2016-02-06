'use strict';

const Handlers = require('./handlers');
const Schema = require('./schema');


module.exports = [
    {
        method: 'POST',
        path: '/queue',
        config: {
            handler: Handlers.queue,
            validate: {
                options: {
                    abortEarly: false,
                    stripUnknown: true
                },
                payload: Schema.add
            },
            response: {
                schema: false
            }
        }
    }
];
