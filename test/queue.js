'use strict';

// Load modules

const Code = require('code');
const Hapi = require('hapi');
const Lab = require('lab');
const Queue = require('../lib/modules/queue');
const Redis = require('hapi-ioredis');

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

    internals.SmsMock = {
        register: (server, options, next) => {

            const client = {
                sendMessage: (payload, cb) => {

                    expect(payload).to.deep.equal({
                        to: '55555',
                        from: undefined,
                        body: 'You have been added to the waitlist. Text \'9\' if you need to cancel.'
                    });

                    cb(null, {});
                }
            };

            server.decorate('request', 'twilio', client);
            return next();
        }
    };

    internals.SmsMock.register.attributes = { name: 'sms' };

    internals.plugins = [
        {
            register: Redis,
            options: { url: 'redis://:@127.0.0.1:6379' }
        },
        {
            register: internals.SmsMock,
            options: null
        },
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

        const redis = internals.server.app.redis;
        redis.flushall();
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

            expect(response.statusCode).to.equal(200);
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
