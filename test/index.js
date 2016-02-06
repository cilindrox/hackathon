'use strict';

// Load modules

const Code = require('code');
const Hapi = require('hapi');
const Lab = require('lab');
const Queue = require('../lib/modules/queue');

// Declare internals

const internals = {};


// Test shortcuts

const lab = exports.lab = Lab.script();
const it = lab.it;
const describe = lab.describe;
const beforeEach = lab.beforeEach;
const afterEach = lab.afterEach;
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


    afterEach((done) => {

        internals.server = null;
        return done();
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
            expect(response.result).to.deep.equal([
                {
                    phone: '55555',
                    name: 'Mr. Pupi'
                }
            ]);
            done();
        });
    });


    it('removes an existing entry from the queue', (done) => {

        const server = internals.server;
        const request = {
            method: 'DELETE',
            url: '/queue'
        };

        server.inject(request, (response) => {

            expect(response.statusCode).to.equal(200);
            expect(response.result).to.be.empty();
            done();
        });
    });


    it('lists the current queue', (done) => {

        const server = internals.server;
        const request = {
            method: 'GET',
            url: '/queue'
        };

        server.inject(request, (response) => {

            expect(response.statusCode).to.equal(200);
            expect(response.result).to.be.empty();
            done();
        });
    });
});
