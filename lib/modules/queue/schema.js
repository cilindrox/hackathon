'use strict';

const Joi = require('joi');

const internals = {
    e164: /^\+?[1-9]\d{1,14}$/,
    mongoId: /^[0-9a-fA-F]{24}$/
};

internals.item = {
    _id: Joi.object(),
    name: Joi.string().min(2).max(64).required(),
    phone: Joi.string().regex(internals.e164).required()
        .options({
            language: {
                string: {
                    regex: {
                        base: 'should be an E.164-compatible phone number'
                    }
                }
            }
        }),
    createdAt: Joi.date().iso(),
    updatedAt: Joi.date().iso()
};


exports.add = internals.item;


exports.queue = Joi.array().items(Joi.object().keys(internals.item));


exports.mongoId = Joi.string().regex(internals.mongoId);
