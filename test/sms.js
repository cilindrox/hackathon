'use strict';

// Load modules

const Code = require('code');
const Hapi = require('hapi');
const Lab = require('lab');
const Sms = require('../lib/modules/sms');

// Declare internals

const internals = {};


// Test shortcuts

const lab = exports.lab = Lab.script();
const it = lab.it;
const describe = lab.describe;
const expect = Code.expect;

describe('SMS', () => {

    it('registers a twilio client', (done) => {

        const plugins = [
            {
                register: Sms,
                options: {
                    acctSid: 'test',
                    authToken: 'test'
                }
            }
        ];

        const server = new Hapi.Server();
        server.connection();

        server.register(plugins, { }, (err) => {

            expect(err).to.not.exist();
            expect(server.app.client).to.exist();
            return done();
        });
    });
});
