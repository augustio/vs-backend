const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const users = require('./routes/users');
const groups = require('./routes/groups');
const auth = require('./routes/auth');
const records = require('./routes/records');

const app = express();

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
  // Provide error message only in development
  //let error = req.app.get('env') === 'development' ? err : {};

  // Send error status and message
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
