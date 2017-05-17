const Group = require('../models/group');

//Send list of groups
exports.getGroups = function(req, res, next) {
  res.send('NOT IMPLEMENTED: GET_GROUPS');
};

//Send one user group
exports.getGroup = function(req, res, next) {
  res.send('NOT IMPLEMENTED: GET_GROUP: ' + req.params.group_id);
};

//Handle create group request
exports.createGroup = function(req, res, next) {
  res.send('NOT IMPLEMENTED: CREATE_GROUP');
};

//Handle delete user request
exports.deleteGroup = function(req, res, next) {
  res.send('NOT IMPLEMENTED: DELETE_GROUP: ' + req.params.group_id);
};

//Handle update user request
exports.updateGroup = function(req, res, next) {
  let result = JSON.stringify(req.body);
  res.send('NOT IMPLEMENTED: UPDATE_GROUP: ' + req.params.group_id + ' : '  + result);
};
