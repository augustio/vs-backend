const express = require('express');
const router = express.Router();

const Auth = require('../controllers/authController');

// POST request for logging in
router.post('/login', Auth.login);

module.exports = router;
