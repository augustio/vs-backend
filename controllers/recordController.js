const async = require('async');

const Record = require('../models/record');
const RecordData = require('../models/recordData');
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
                  record.set({
                    size: record.size + req.body.chOne.length
                  });
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

//Handle delete record request
exports.deleteRecord = (req, res, next) => {
  async.parallel([
    callback => RecordData.remove({_id: req.params.record_id}, callback),
    callback => Record.remove({_id: req.params.record_id}, callback)
  ], err => {
    if(err) { return res.send(err); }
    res.status(200).send({message: "Record successfully deleted"});
  });
};
