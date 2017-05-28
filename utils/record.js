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
      size: reqBody.chOne.length,
      samplingRate: reqBody.samplingRate || 250,
      pEStart: reqBody.pEStart ? [reqBody.pEStart * 1000] : [],
      pEEnd: reqBody.pEEnd ? [reqBody.pEEnd *1000] : [],
      temp: {count: 1, value: reqBody.temp}
    });
  },

  buildRecordData: reqBody => {
    return new RecordData({
      _id: `${reqBody.patientId}_${reqBody.type}_${reqBody.recStart}`,
      chOne: {[reqBody.start]: reqBody.chOne},
      chTwo: {[reqBody.start]: reqBody.chTwo},
      chThree: {[reqBody.start]: reqBody.chThree}
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
  }
}
