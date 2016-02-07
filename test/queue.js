'use strict';

// Load modules

const Code = require('code');
const Hapi = require('hapi');
const Lab = require('lab');
const Queue = require('../lib/modules/queue');
const Mongo = require('../lib/modules/db');
const Client = require('../lib/modules/db/model');

// Declare internals

const internals = {};


// Test shortcuts

const lab = exports.lab = Lab.script();
const it = lab.it;
const describe = lab.describe;
const afterEach = lab.afterEach;
const before = lab.before;
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
            register: Mongo,
            options: { url: 'mongodb://localhost/test' }
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


    before((done) => {

        const server = new Hapi.Server();
        server.connection();

        server.register(internals.plugins, {}, (err) => {

            expect(err).to.not.exist();
            internals.server = server;
            return done();
        });
    });


    afterEach((done) => {

        return Client.remove({}, done);
    });


    it('pushes a new entry to the queue', (done) => {

        const server = internals.server;
        const request = {
            method: 'POST',
            url: '/items',
            payload: {
                phone: '55555',
                name: 'Mr. Pupi'
            }
        };

        server.inject(request, (response) => {

            expect(response.statusCode).to.equal(200);
            Client
                .find({})
                .lean()
                .exec((err, list) => {

                    expect(err).to.not.exist();
                    expect(response.result).to.have.length(1);

                    delete list[0].__v;

                    expect(response.result).to.deep.equal(list);
                    done();
                });
        });
    });


    it('removes an existing entry from the queue', (done) => {

        Client.create({
            phone: '55555',
            name: 'Mr. Pupi'
        }, (err, saved) => {

            expect(err).to.not.exist();

            const server = internals.server;
            const request = {
                method: 'DELETE',
                url: `/items/${ saved.id }`
            };

            server.inject(request, (response) => {


                expect(response.statusCode).to.equal(200);
                expect(response.result).to.be.empty();
                done();
            });
        });
    });


    it('lists the current queue', (done) => {

        const server = internals.server;
        const request = {
            method: 'GET',
            url: '/items'
        };

        server.inject(request, (response) => {

            expect(response.statusCode).to.equal(200);
            expect(response.result).to.be.empty();
            done();
        });
    });
});
