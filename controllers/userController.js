const User = require('../models/user');
const Record = require('../models/user');

//Send list of users
exports.getUsers = function(req, res, next) {
  User.find()
    .exec((err, list_users) => {
      if(err) { return next(err); }
      res.status(200).send({users: list_users});
    });
};

//Send list of patient-users
exports.getPatients = function(req, res, next) {
  User.find({role: 'patient'})
    .exec((err, list_users) => {
      if(err) { return next(err); }
      res.status(200).send({users: list_users});
    });
};

//Send one user
exports.getUser = function(req, res, next) {
  User.findOne({userId: req.params.userId})
    .populate('group')
    .exec((err, user) => {
      if(err) { return next(err); }
      res.status(200).send(user);
    });
};

//Handle create user request
exports.createUser = function(req, res, next) {
  const user = new User(req.body);
  user.save(err => {
    if(err) { return next(err); }
    res.status(200).send({message: 'user successfully created'});
  });
};

//Handle delete user request
exports.deleteUser = function(req, res, next) {
  Record.findOne({patientId: req.params.userId})
    .exec((err, record) => {
      if(record){
        let err = new Error('User has at least one record and cannot be deleted');
        err.status = 403;
        return next(err);
      }
      User.deleteOne({userId: req.params.userId})
        .exec( err => {
          if(err) { return next(err); }
          res.status(200).send({message: 'user successfully deleted'});
        });
    });
};

//Handle update user request
exports.updateUser = function(req, res, next) {
  let query = {userId: req.params.userId};
  let update = {};
  if(req.body.email) { update.email = req.body.email};
  if(req.body.password) { update.password = req.body.password};
  User.findOne(query, update)
    .exec((err, user) => {
      if(err) { return next(err); }
      user.set(update);
      user.save(err => {
        if(err) { return next(err); }
        res.status(200).send({message: 'User update successful'});
      });
    });
};
