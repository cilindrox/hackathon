'use strict';

// Load modules

const Code = require('code');
const Hapi = require('hapi');
const Lab = require('lab');
const Info = require('../lib/modules/info');

// Declare internals

const internals = {};


// Test shortcuts

const lab = exports.lab = Lab.script();
const it = lab.it;
const describe = lab.describe;
const expect = Code.expect;

describe('Info', () => {

    it('replies with server info', (done) => {

        const server = new Hapi.Server();
        server.connection();

        server.register(Info, (err) => {

            expect(err).to.not.exist();

            const request = {
                method: 'GET',
                url: '/'
            };

            server.inject(request, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.deep.equal({ ver: process.env.npm_package_version });
                done();
            });
        });
    });
});
