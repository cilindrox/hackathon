'use strict';

const Handlers = require('./handlers');
const Schema = require('./schema');


module.exports = [
    {
        method: 'POST',
        path: '/items',
        config: {
            pre: [
                {
                    method: Handlers.add,
                    assign: 'responseData'
                },
                {
                    method: Handlers.sendSms,
                    assign: 'responseData'
                }
            ],
            handler: Handlers.list,
            validate: {
                options: {
                    abortEarly: false,
                    stripUnknown: true
                },
                payload: Schema.add
            },
            response: {
                schema: Schema.queue,
                modify: true,
                options: {
                    stripUnknown: true
                }
            }
        }
    },
    {
        method: 'DELETE',
        path: '/items/{id}',
        config: {
            pre: [
                {
                    method: Handlers.remove,
                    assign: 'responseData'
                }
            ],
            handler: Handlers.list,
            validate: {
                options: {
                    abortEarly: false,
                    stripUnknown: true
                },
                payload: false,
                params: {
                    id: Schema.mongoId
                }
            },
            response: {
                schema: Schema.queue,
                modify: true,
                options: {
                    stripUnknown: true
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/items',
        config: {
            handler: Handlers.list,
            validate: {
                options: {
                    abortEarly: false,
                    stripUnknown: true
                },
                payload: false
            },
            response: {
                schema: Schema.queue,
                modify: true,
                options: {
                    stripUnknown: true
                }
            }
        }
    }
];
