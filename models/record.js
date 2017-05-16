const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const recordSchema = Schema({
  _id: {type: String, required: true},
  patientId: {type: String, required: true},
  type: {type: String, required: true},
  startTimeStamp: {type: Number, required: true},
  endTimeStamp: {type: Number},
  size: {type: Number},
  samplingRate: {type: Number, default: 250},
  pEStart: [{type: Number}],
  pEEnd: [{type: Number}],
  temp: [{type: Number}],
  sessionConfigParams: {type: {}}
});

recordSchema.index({timeStamp: 1, patientId: 1});
recordSchema.index({patientId: 1});
recordSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Record', recordSchema);
