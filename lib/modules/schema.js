'use strict';

const Joi = require('joi');

const internals = {
    e164: /^\+?[1-9]\d{1,14}$/
};


exports.add = {
    name: Joi.string().min(2).max(64),
    phone: Joi.string().regex(internals.e164).required()
        .options({
            language: {
                string: {
                    regex: {
                        base: 'should be an E.164-compatible phone number'
                    }
                }
            }
        })
}
