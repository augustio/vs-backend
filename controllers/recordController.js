const Record = require('../models/record');

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

//Handle create record request
exports.createRecord = (req, res, next) => {
  res.send('NOT IMPLEMENTED: CREATE_RECORD');
};

//Handle delete record request
exports.deleteRecord = (req, res, next) => {
  res.send('NOT IMPLEMENTED: DELETE_RECORD: ' + req.params.record_id);
};
