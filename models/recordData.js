const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const recordDataSchema = Schema({
    _id: {type: String, required: true},
    chOne: {type: [Number]},
    chTwo: {type: [Number]},
    chThree: {type: [Number]}
});

recordDataSchema.plugin(uniqueValidator);

module.exports = mongoose.model('RecordData', recordDataSchema);
