'use strict';

const Mongoose = require('mongoose');

const internals = {};

internals.schema = new Mongoose.Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true, index: true }
    },
    {
        timestamps: true
    }
);


module.exports = Mongoose.model('item', internals.schema);
