const express = require('express');
const router = express.Router();

// Require controller modules
const User = require('../controllers/userController');

// POST request for creating user.
router.post('/', User.createUser);

// GET request for a single user.
router.get('/:userId', User.getUser);

// GET request for list of users.
router.get('/', User.getUsers);

// POST request to delete user.
router.post('/:userId/delete', User.deleteUser);

// POST request to update user.
router.post('/:query/update', User.updateUser);

module.exports = router;
