const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const recordAnalysisSchema = Schema({
    _id: {type: String, required: true},
    rPeaks: {type: {}},
    pvcEvents: {type: {}},
    rrIntervals: {type: {}},
    hrvFeatures: {type: {}}
});

recordAnalysisSchema.plugin(uniqueValidator);

module.exports = mongoose.model('RecordAnalysis', recordAnalysisSchema);