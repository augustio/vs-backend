const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;

const userSchema = Schema({
  userId: {type: String, required: true, max: 100},
  email: {type: String, max: 100}
  pwd: {type: String, required: true},
  role: {type: String, required: true, enum: ['sudo', 'admin', 'doctor', 'patient']}
  group: {type: Schema.ObjectId, ref: 'Group', required: true}
});
userSchema.index({userId: 1}, {unique: true});
userSchema.index({role: 1});
userSchema.index({role: 1, group: 1});
userSchema.plugin(uniqueValidator);

userSchema.pre('save', function(next){
  const user = this;
  if(!user.isModified('pwd')) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
    if(err) return next(err);
    bcrypt.hash(user.pwd, salt, function(err, hash){
      if(err) return next(err);
      user.pwd = hash;
      next();
    });
  });
});

module.exports = mongoose.model('User', userSchema);
