const express = require('express');
const router = express.Router();
const checkAuthenticated = require('../services/checkAuthenticated');

// Require controller modules
const User = require('../controllers/userController');

//Apply authentication middleware
router.use(checkAuthenticated.authenticate);

// POST request for creating user.
router.post('/', User.createUser);

// GET request for list of users with role patient
router.get('/patients', User.getPatients);

// GET request for a single user.
router.get('/:userId', User.getUser);

// GET request for list of users.
router.get('/', User.getUsers);

// DELETE request to delete user.
router.delete('/:userId', User.deleteUser);

// PUT request to update user.
router.put('/:userId', User.updateUser);

module.exports = router;
