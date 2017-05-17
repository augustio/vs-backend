const express = require('express');
const router = express.Router();

const Record = require('../controllers/recordController');

// POST request for creating record.
router.post('/', Record.createRecord);

// GET request for list of records for a specified patient
router.get('/user/:userId', Record.getRecords);

// GET request for list of records for a specified group
router.get('/group/:group_id', Record.getRecords);

// GET request for a single record.
router.get('/:record_id', Record.getRecord);

// POST request to delete record.
router.post('/:record_id/delete', Record.deleteRecord);

module.exports = router;
