const User = require('../models/user');
const Record = require('../models/user');

//Get list of users
exports.getUsers = (req, res, next) => {
  let query = {};
  let role = req.user.role;
  if(role === 'patient') {
    query.userId = req.user.userId;
  }else if(role === 'doctor') {
    query.group = req.user.group;
    query.role = 'patient';
  }else if(role === 'admin') {
    query.group = req.user.group;
    query.$or = [{role: /doctor/}, {role: /patient/}];
  }else{query.role = {$not: /sudo/}}
  User.find(query)
    .exec((err, list_users) => {
      if(err) { return next(err); }
      res.status(200).send({users: list_users});
    });
};

//Get list of patient-users
exports.getPatients = (req, res, next) => {
  let query = {role: 'patient'};
  let role = req.user.role;
  if(role === 'patient') {query.userId = req.user.userId;}
  if(role === 'admin' || role === 'doctor') {query.group = req.user.group;}
  User.find(query)
    .exec((err, list_users) => {
      if(err) { return next(err); }
      res.status(200).send({users: list_users});
    });
};

//Get one user
exports.getUser = (req, res, next) => {
  let role = req.user.role;
  let query = {userId: req.params.userId};
  if(role === 'admin' || role === 'doctor'){query.group = req.user.group;}
  if(role === 'patient'){query.userId = req.user.userId;}
  User.findOne(query)
    .populate('group')
    .exec((err, user) => {
      if(err) { return next(err); }
      res.status(200).send(user);
    });
};

//Handle create user request
exports.createUser = (req, res, next) => {
  const user = new User(req.body);
  if(req.user.role === 'sudo' ||
    (req.user.role === 'admin' && req.user.group == user.group)){
    user.save(err => {
      if(err) { return next(err); }
      res.status(200).send({message: 'user successfully created'});
    });
  }else {return next({status: 403, message: 'Not authorized'});}
};

//Handle delete user request
exports.deleteUser = (req, res, next) => {
  let role = req.user.role;
  if(role !== 'sudo' && role !== 'admin'){
    return next({status: 403, message: 'Not authorized'});
  }
  User.findOne({userId: req.params.userId})
    .exec((err, user) => {
      if(user){
        if(role === 'admin' && req.user.group != user.group){
          return next({status: 403, message: 'Not authorized'});
        }
        Record.findOne({patientId: req.params.userId})
          .exec((err, record) => {
            if(record){
              return next({status: 403, message: 'User has at least one record and cannot be deleted'});
            }
            User.deleteOne({userId: req.params.userId})
              .exec( err => {
                if(err) { return next(err); }
                res.status(200).send({message: 'user successfully deleted'});
              });
          });
      }
    });
};

//Handle update user request
exports.updateUser = function(req, res, next) {
  if(req.params.userId != req.user.userId){
    return next({status: 403, message: 'Not authorized'});
  }
  let query = {userId: req.params.userId};
  let update = {};
  if(req.body.email) { update.email = req.body.email};
  if(req.body.password) { update.password = req.body.password};
  User.findOne(query)
    .exec((err, user) => {
      if(err) { return next(err); }
      user.set(update);
      user.save(err => {
        if(err) { return next(err); }
        res.status(200).send({message: 'User update successful'});
      });
    });
};
