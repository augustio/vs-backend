const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const recordDataSchema = Schema({
    _id: {type: String, required: true},
    chOne: {type: {}},
    chTwo: {type: {}},
    chThree: {type: {}}
});

recordDataSchema.plugin(uniqueValidator);

module.exports = mongoose.model('RecordData', recordDataSchema);
