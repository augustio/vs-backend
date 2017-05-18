const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const _ = require('lodash');

const users = require('./routes/users');
const groups = require('./routes/groups');
const auth = require('./routes/auth');
const records = require('./routes/records');

const app = express();

//Set up mongoose connection
const mongoose = require('mongoose');
const dbURL = "mongodb://83.136.249.208:27017/vs_db";
mongoose.connect(dbURL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../vitalsens-client/dist')));

app.use('/auth', auth);
app.use('/api/users', users);
app.use('/api/groups', groups);
app.use('/api/records', records);

// catch 404 and forward to error handler
app.use( (req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use( (err, req, res, next) => {
  //let error = req.app.get('env') === 'development' ? err : {};
  let message = _.get(err, 'errors.code.message');
  let status = err.status;
  if(message) status = 400;
  res.status(err.status || 500).send({message: message || err.message});
});

module.exports = app;
