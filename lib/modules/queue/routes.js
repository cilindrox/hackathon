'use strict';

const Handlers = require('./handlers');
const Schema = require('./schema');


module.exports = [
    {
        method: 'POST',
        path: '/queue',
        config: {
            handler: Handlers.push,
            validate: {
                options: {
                    abortEarly: false,
                    stripUnknown: true
                },
                payload: Schema.add
            },
            response: {
                schema: Schema.queue
            }
        }
    },
    {
        method: 'DELETE',
        path: '/queue',
        config: {
            handler: Handlers.shift,
            validate: {
                options: {
                    abortEarly: false,
                    stripUnknown: true
                },
                payload: false
            },
            response: {
                schema: Schema.queue
            }
        }
    },
    {
        method: 'GET',
        path: '/queue',
        config: {
            handler: Handlers.get,
            validate: {
                options: {
                    abortEarly: false,
                    stripUnknown: true
                },
                payload: false
            },
            response: {
                schema: Schema.queue
            }
        }
    }
];
