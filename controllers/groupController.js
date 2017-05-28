const Group = require('../models/group');
const User = require('../models/user');

//Get list of groups
exports.getGroups = function(req, res, next) {
  let query = {};
  if(req.user.role != 'sudo') { query._id = req.user.group; }
  Group.find(query)
    .exec((err, list_groups) => {
      if(err) { return next(err); }
      res.status(200).send({groups: list_groups});
    });
};

//Get one user group
exports.getGroup = function(req, res, next) {
  let role = req.user.role;
  let group = req.user.group;
  if(role != 'sudo' && group != req.params.group_id) {
    return next({status: 400, message: 'Not Authorized'});
  }
  Group.findOne({_id: req.params.group_id})
    .exec((err, group) => {
      if(err) { return next(err); }
      res.status(200).send({group});
    });
};

//Handle create group request
exports.createGroup = (req, res, next) => {
  if(req.user.role != 'sudo'){
    return next({status: 400, message: 'Not Authorized'});
  }
  const group = new Group(req.body);
  if(!group.name || !group.code){
    let err = new Error('Group name and/or code is required');
    err.status = 400;
    return next(err);
  }
  group.save(err => {
    if(err) { return next(err); }
    res.status(200).send({message: 'group successfully created'});
  });
};

//Handle delete group request
exports.deleteGroup = function(req, res, next) {
  if(req.user.role != 'sudo'){
    return next({status: 400, message: 'Not Authorized'});
  }
  User.findOne({group: req.params.group_id})
    .exec((err, user) => {
      if(user){
        let err = new Error('Group is referenced by at least one user and cannot be deleted');
        err.status = 403;
        return next(err);
      }
      Group.deleteOne({_id: req.params.group_id})
        .exec( err => {
          if(err) { return next(err); }
          res.status(200).send({message: 'group successfully deleted'});
        });
    });
};

//Handle update group request
exports.updateGroup = function(req, res, next) {
  if(req.user.role != 'sudo'){
    return next({status: 400, message: 'Not Authorized'});
  }
  let query = {_id: req.params.group_id};
  let update = {};
  if(req.body.code) { update.code = req.body.code};
  if(req.body.name) { update.name = req.body.name};
  Group.updateOne(query, update)
    .exec((err, result) => {
      if(err) { return next(err); }
      res.status(200).send({message: `${result.nModified} group updated!`});
    });
};
