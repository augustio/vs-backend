const Record = require('../models/record');
const RecordData = require('../models/recordData');

module.exports = {
  buildRecord: reqBody => {
    return new Record({
      _id: `${reqBody.patientId}_${reqBody.type}_${reqBody.recStart}`,
      patientId: reqBody.patientId,
      type: reqBody.type,
      recStart: reqBody.recStart,
      recEnd: reqBody.recEnd || 0,
      duration: reqBody.end - reqBody.recStart,
      size: reqBody.chOne.length,
      samplingRate: reqBody.samplingRate || 250,
      pEStart: reqBody.pEStart != 0 ? [reqBody.pEStart] : [],
      pEEnd: reqBody.pEEnd != 0 ? [reqBody.pEEnd] : [],
      temp: {count: 1, value: reqBody.temp}
    });
  },

  buildRecordData: reqBody => {
    return new RecordData({
      _id: `${reqBody.patientId}_${reqBody.type}_${reqBody.recStart}`,
      chOne: reqBody.chOne,
      chTwo: reqBody.chTwo,
      chThree: reqBody.chThree
    });
  },

  buildRecordAnalysis: data => {
    return new RecordAnalysis({
      _id: data.requestId,
      rPeaks: data.rpeaks,
      pvcEvents: data.pvcevents,
      rrIntervals: data.rrintervals,
      hrvFeatures: data.hrvfeatures,
      afibEvents: afibEvents
    });
  },

  calculateHeartRate: rrIntervals => {
    if(rrIntervals.length === 0){
      return null;
    }
    let sum = rrIntervals.reduce((a, b) => a + b);
    let averageRRInterval = sum/rrIntervals.length;
    return Math.round(60/averageRRInterval);
  }
}
