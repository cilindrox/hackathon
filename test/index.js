'use strict';

'use strict';

// Load modules

const Code = require('code');
const Hapi = require('hapi');
const Lab = require('lab');
const Queue = require('../lib/modules');

// Declare internals

const internals = {};


// Test shortcuts

const lab = exports.lab = Lab.script();
const it = lab.it;
const describe = lab.describe;
const before = lab.before;
const beforeEach = lab.beforeEach;
const afterEach = lab.afterEach;
const after = lab.after;
const expect = Code.expect;


describe('Queue', () => {

    internals.plugins = [
        {
            register: Queue,
            options: {}
        }
    ];

    beforeEach((done) => {
        const server = new Hapi.Server();
        server.connection();

        server.register(internals.plugins, {}, (err) => {

            expect(err).to.not.exist();
            internals.server = server;
            return done();
        });
    });


    it('pushes a new entry to the queue', (done) => {

        const server = internals.server;
        const request = {
            method: 'POST',
            url: '/queue',
            payload: {
                phone: '55555',
                name: 'Mr. Pupi'
            }
        };

        server.inject(request, (response) => {

            expect(response.statusCode).to.equal(201);
            expect(response.result).to.deep.equal(null);
            done();
        });
    });
});
