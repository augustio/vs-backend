const express = require('express');
const router = express.Router();
const checkAuthenticated = require('../services/checkAuthenticated');

//Apply authentication middleware
router.use(checkAuthenticated.authenticate);

// Require controller modules
const Group = require('../controllers/groupController');

// POST request for creating group.
router.post('/', Group.createGroup);

// GET request for a single group.
router.get('/:group_id', Group.getGroup);

// GET request for list of groups.
router.get('/', Group.getGroups);

// POST request to delete group.
router.delete('/:group_id', Group.deleteGroup);

// POST request to update group.
router.put('/:group_id', Group.updateGroup);

module.exports = router;
