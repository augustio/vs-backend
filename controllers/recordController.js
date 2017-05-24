const Record = require('../models/record');
const recordUtil = require('../utils/record');

//Get list of records
exports.getRecords = (req, res, next) => {
  let result = '';
  if(req.params.userId) result = 'userId: ' + req.params.userId;
  if(req.params.group_id) result = 'group_id: ' + req.params.group_id;
  res.send('NOT IMPLEMENTED: GET_RECORDS: ' + result);
};

//Get a single record
exports.getRecord = (req, res, next) => {
  res.send('NOT IMPLEMENTED: GET_RECORD: ' + req.params.record_id);
};

//Handle POST record request
exports.postRecord = (req, res, next) => {
  let _id = `${req.body.patientId}_${req.body.type}_${req.body.recStart}`;
  Record.findOne({_id})
    .exec((err, existingRec) => {
      if(existingRec){ //If Record exists
        //Update record's size
        Record.findOne({_id})
          .exec((err, record) => {
            if(record){
              record.set({
                size: record.size + req.body.chOne.length
              });
              record.save(err => console.log(err));
            }
          });
        //Update record's data
        RecordData.findOne({_id})
          .exec((err, recordData) => {
            if(recordData){
              recordData.set({
                chOne: [...recordData.chOne, ...req.body.chOne],
                chTwo: [...recordData.chTwo, ...req.body.chTwo],
                chThree: [...recordData.chThree, ...req.body.chThree]
              });
              recordData.save(err => console.log(err));
            }
          });
      }else{//Create new record
        const record = recordUtil.buildRecord(req.body);
        const recordData = recordUtil.buildRecordData(req.body);
        record.save(err => console.log(err));
        recordData.save(err => console.log(err));
      }
      res.status(200).send({_id});
    });
};

//Handle delete record request
exports.deleteRecord = (req, res, next) => {
  res.send('NOT IMPLEMENTED: DELETE_RECORD: ' + req.params.record_id);
};
