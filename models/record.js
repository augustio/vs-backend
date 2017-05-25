const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const recordSchema = Schema({
  _id: {type: String, required: true},
  patientId: {type: String, required: true},
  type: {type: String, required: true},
  recStart: {type: Number, required: true},
  recEnd: {type: Number},
  size: {type: Number},
  samplingRate: {type: Number},
  pEStart: {type: [Number]},
  pEEnd: {type: [Number]},
  temp: {type: [Number]},
  alarms: {type: [{}]}
});

recordSchema.index({patientId: 1});
recordSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Record', recordSchema);
