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

//Get a single record with data
exports.getRecordWithData = (req, res, next) => {
  Record.findOne({_id: req.params.record_id})
    .exec((err, record) => {
      if(err) { return next(err); }
      RecordData.findOne({_id: req.params.record_id})
        .exec((err, data) => {
          if(err) { return next(err); }
          let fullRecord = {};
          Object.assign(fullRecord, record._doc, {
            chOne: data.chOne,
            chTwo: data.chTwo,
            chThree: data.chThree
          });
          res.status(200).send(fullRecord);
        });
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
                    recEnd: req.body.recEnd,
                    temp: {
                      count,
                      value
                    }
                  };
                  if(req.body.pEStart != 0){
                    update.pEStart = [...record.pEStart, req.body.pEStart + record.size];
                  }
                  if(req.body.pEEnd != 0){
                    update.pEEnd = [...record.pEEnd, req.body.pEEnd + record.size];
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
                    chOne: [...recordData.chOne, ...req.body.chOne],
                    chTwo: [...recordData.chTwo, ...req.body.chTwo],
                    chThree: [...recordData.chThree, ...req.body.chThree]
                  });
                  recordData.save(callback);
                }else{ callback(err); }
              });
          }
        ], err =>  {
          if(err) { return res.send(err); }
          res.status(200).send({message: "Record upload successful"});
        });
      }else{//Create new record
        const record = recordUtil.buildRecord(req.body);
        const recordData = recordUtil.buildRecordData(req.body);
        async.parallel([
          callback => record.save(callback),
          callback => recordData.save(callback)
        ], err => {
          if(err) { return res.send(err); }
          res.status(200).send({message: "Record upload successful"});
        });
      }
    });
};

//Handle GET record data request for some chunk of data
exports.getRecordDataChunk = (req, res, next) => {
  let query = {};
  if(req.params.startIndex) { query.startIndex = req.params.startIndex; }
  if(req.params.endIndex) { query.endIndex = req.params.endIndex; }
  RecordData.findOne({_id: req.params.record_id})
    .exec((err, data) => {
      if(err) { return next(err); }
      let chOne = data.chOne || [];
      let chTwo = data.chTwo || [];
      let chThree = data.chThree || [];
      if(query.startIndex < chOne.length) {
        chOne = chOne.slice(query.startIndex, query.endIndex);
      }
      if(query.startIndex < chTwo.length) {
        chTwo = chTwo.slice(query.startIndex, query.endIndex);
      }
      if(query.startIndex < chThree.length) {
        chThree = chThree.slice(query.startIndex, query.endIndex);
      }
      res.status(200).send({chOne, chTwo, chThree});
    });
}

//Handle GET record data request
exports.getRecordData = (req, res, next) => {
  RecordData.findOne({_id: req.params.record_id})
    .exec((err, data) => {
      if(err) { return next(err); }
      res.status(200).send(data);
    });
}

//Handle GET record analysis request
exports.getRecordAnalysis = (req, res, next) => {
  RecordAnalysis.findOne({_id: req.params.record_id})
    .exec((err, analysis) => {
      if(err) { return next(err); }
      res.status(200).send(analysis);
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
