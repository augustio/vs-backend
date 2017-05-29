const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../config/config');
const User = require('../models/user');

exports.authenticate = (req, res, next) => {
  if(req.method == 'OPTIONS'){
    return next();
  }
  if(!req.header('Authorization')) {
    return next({status: 401, message: 'Not Authorized'});
  }
  const token = req.header('Authorization').split(' ')[1];
  const payload = jwt.decode(token, config.TOKEN_SECRET);

  let authUser = payload.user;
  User.findOne({userId: authUser.userId})
    .exec((err, user) => {
      if(!user) {
        return next({status: 401, message: 'Invalid Authorization'});
      }
      if(payload.exp <= moment().unix()){
        return next({status: 401, message: 'Token has expired'});
      }
      req.user = authUser;

      next();
    });
};
