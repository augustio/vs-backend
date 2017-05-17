const User = require('../models/user');

//Send list of users
exports.getUsers = function(req, res, next) {
  res.send('NOT IMPLEMENTED: GET_USERS');
};

//Send list of patient-users
exports.getPatients = function(req, res, next) {
  res.send('NOT IMPLEMENTED: GET_PATIENTS');
};

//Send one user
exports.getUser = function(req, res, next) {
  res.send('NOT IMPLEMENTED: GET_USER: ' + req.params.userId);
};

//Handle create user request
exports.createUser = function(req, res, next) {
  res.send('NOT IMPLEMENTED: CREATE_USER');
};

//Handle delete user request
exports.deleteUser = function(req, res, next) {
  res.send('NOT IMPLEMENTED: DELETE_USER');
};

//Handle update user request
exports.updateUser = function(req, res, next) {
  res.send('NOT IMPLEMENTED: UPDATE_USER');
};
