'use strict';

// const Boom = require('boom');

const internals = {
    queue: []
};


exports.push = (request, reply) => {

    internals.queue.push(request.payload);
    return reply(internals.queue).code(201);
};


exports.pop = (request, reply) => {

    internals.queue.pop();
    return reply(internals.queue).code(200);
};


exports.get = (request, reply) => {

    return reply(internals.queue);
};
