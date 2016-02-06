'use strict';

// const Boom = require('boom');

const internals = {
    queue: []
};


exports.push = (request, reply) => {

    internals.queue.push(request.payload);
    return reply(internals.queue).code(201);
};


exports.shift = (request, reply) => {

    internals.queue.shift();
    return reply(internals.queue).code(200);
};


exports.get = (request, reply) => {

    return reply(internals.queue);
};
