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
      pEStart: req.Body.pEStart >= 0 ? [reqBody.pEStart] : [],
      pEEnd: req.Body.pEEnd >= 0 ? [reqBody.pEEnd] : [],
      temp: [reqBody.temp]
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
