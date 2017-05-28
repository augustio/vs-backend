const async = require('async');

const Record = require('../models/record');
const RecordData = require('../models/recordData');
const RecordAnalysis = require('../models/recordAnalysis');
const recordUtil = require('../utils/record');

//Get list of records for a specified patient
exports.getRecords = (req, res, next) => {
  Record.find({patientId: req.params.userId})
    .sort({recStart: -1})
    .exec((err, records) => {
      if(err) { return next(err); }
      res.status(200).send(records);
    });
};

//Get a single record
exports.getRecord = (req, res, next) => {
  Record.findOne({_id: req.params.record_id})
    .exec((err, record) => {
      if(err) { return next(err); }
      res.status(200).send(record);
    });
};

//Handle POST record request
exports.postRecord = (req, res, next) => {
  let _id = `${req.body.patientId}_${req.body.type}_${req.body.recStart}`;
  Record.findOne({_id})
    .exec((err, existingRec) => {
      if(existingRec){ //If Record exists
        async.parallel([
          callback => {
            //Update record's size
            Record.findOne({_id})
              .exec((err, record) => {
                if(record){
                  let count = record.temp.count + 1;
                  let value = (record.temp.value + req.body.temp) / count;
                  let update = {
                    size: record.size + req.body.chOne.length,
                    temp: {
                      count,
                      value
                    }
                  };
                  if(req.body.pEStart >= 0){
                    update.pEStart = [...record.pEStart, req.body.pEStart * 1000];
                  }
                  if(req.body.pEEnd >= 0){
                    update.pEEnd = [...record.pEEnd, req.body.pEEnd * 1000];
                  }
                  record.set(update);
                  record.save(callback);
                }else { callback(err); }
              });
          },
          callback => {
            //Update record's data
            RecordData.findOne({_id})
              .exec((err, recordData) => {
                if(recordData){
                  recordData.set({
                    chOne: Object.assign({[req.body.start]: req.body.chOne}, recordData.chOne),
                    chTwo: Object.assign({[req.body.start]: req.body.chTwo}, recordData.chTwo),
                    chThree: Object.assign({[req.body.start]: req.body.chThree}, recordData.chThree)
                  });
                  recordData.save(callback);
                }else{ callback(err); }
              });
          }
        ], err =>  {
          if(err) { return res.send(err); }
          res.status(200).send({message: "Record successfully saved"});
        });
      }else{//Create new record
        const record = recordUtil.buildRecord(req.body);
        const recordData = recordUtil.buildRecordData(req.body);
        async.parallel([
          callback => record.save(callback),
          callback => recordData.save(callback)
        ], err => {
          if(err) { return res.send(err); }
          res.status(200).send({message: "Record successfully saved"});
        });
      }
    });
};

//Handle GET record data request
exports.getRecordData = (req, res, next) => {
  RecordData.findOne({_id: req.params.record_id})
    .exec((err, data) => {
      if(err) { next(err); }
      else if(data) {
        let compareFunction = (a, b) => Number(a) - Number(b);
        let chOneKeys = Object.keys(data.chOne || []).sort(compareFunction);
        let chTwoKeys = Object.keys(data.chTwo || []).sort(compareFunction);
        let chThreeKeys = Object.keys(data.chThree || []).sort(compareFunction);
        let chOne = chOneKeys.map(k => data.chOne[k])
                             .reduce((acc, r) => [...acc, ...r]);
        let chTwo = chTwoKeys.map(k => data.chTwo[k])
                             .reduce((acc, r) => [...acc, ...r]);
        let chThree = chThreeKeys.map(k => data.chThree[k])
                             .reduce((acc, r) => [...acc, ...r]);
        res.status(200).send({_id: data._id, chOne, chTwo, chThree});
      }
    else { next({status: 400, message: "Not found"}) }
    });
}

//Handle GET record analysis request
exports.getRecordAnalysis = (req, res, next) => {
  RecordAnalysis.findOne({_id: req.params.record_id})
    .exec((err, recordAnalysis) => {
      if(err) { return next(err); }
      res.status(200).send(recordAnalysis);
    });
}

//Handle DELETE record request
exports.deleteRecord = (req, res, next) => {
  async.parallel([
    callback => RecordData.remove({_id: req.params.record_id}, callback),
    callback => Record.remove({_id: req.params.record_id}, callback)
  ], err => {
    if(err) { return res.send(err); }
    res.status(200).send({message: "Record successfully deleted"});
  });
};
