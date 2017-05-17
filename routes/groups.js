const express = require('express');
const router = express.Router();

// Require controller modules
const Group = require('../controllers/groupController');

// POST request for creating group.
router.post('/', Group.createGroup);

// GET request for a single group.
router.get('/:group_id', Group.getGroup);

// GET request for list of groups.
router.get('/', Group.getGroups);

// POST request to delete group.
router.post('/:group_id/delete', Group.deleteGroup);

// POST request to update group.
router.post('/:group_id/update', Group.updateGroup);

module.exports = router;
