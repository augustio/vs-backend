const express = require('express');
const router = express.Router();
const checkAuthenticated = require('../services/checkAuthenticated');

const Record = require('../controllers/recordController');

//Apply authentication middleware
router.use(checkAuthenticated.authenticate);

// POST request for creating record.
router.post('/', Record.postRecord);

// GET request for list of records for a specified patient
router.get('/user/:userId', Record.getRecords);

// GET request for a single record.
router.get('/:record_id', Record.getRecord);

// DELETE request to delete record.
router.delete('/:record_id', Record.deleteRecord);

module.exports = router;
