const express = require('express');
const router = express.Router();
const checkAuthenticated = require('../services/checkAuthenticated');
const ospp = require('../services/ospp');

const Record = require('../controllers/recordController');

//Apply authentication middleware
router.use(checkAuthenticated.authenticate);

// POST request for creating record.
router.post('/', ospp.analyse, Record.postRecord);

// GET request for list of records for a specified patient
router.get('/user/:userId', Record.getRecords);

// GET request for a single record.
router.get('/:record_id', Record.getRecord);

// GET request for record data.
router.get('/:record_id/startIndex/:startIndex/endIndex/:endIndex', Record.getRecordDataChunk);

// GET request for record data.
router.get('/:record_id/data', Record.getRecordData);

// GET request for record analysis.
router.get('/:record_id/analysis', Record.getRecordAnalysis);

// DELETE request to delete record.
router.delete('/:record_id', Record.deleteRecord);

module.exports = router;
