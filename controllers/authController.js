const User = require('../models/user');
const jwt = require('jwt-simple');
const moment = require('moment');
const bcrypt = require('bcrypt');
const config = require('../config/config');

//User login
exports.login = (req, res, next) => {
  User.findOne({userId: req.body.userId}, (err, user) => {
    if(!user) {
      return next({status: 404, message: 'User not registered'});
    }
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if(result){
        res.status(200).send({token: createToken(user)});
      }else{
        return next({status: 400, message: 'Wrong password'});
      }
    });
  });
};

const createToken = user => {
  const payload = {
    user:{
      _id: user._id,
      userId: user.userId,
      role: user.role,
      group: user.group
    },
    iat: moment().unix(),
    exp: moment().add(48, 'hours').unix()
  };

  return jwt.encode(payload, config.TOKEN_SECRET);
};
