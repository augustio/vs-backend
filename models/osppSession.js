const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const osppSessionSchema = Schema({
  _id: {type: String, required: true},
  sessionConfigParams: {type: {}}
});

osppSessionSchema.plugin(uniqueValidator);

module.exports = mongoose.model('OSPPSession', osppSessionSchema);
