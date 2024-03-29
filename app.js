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
const config = require('./config/config');
const cors = require('./services/cors');

const app = express();

//Set up mongoose connection
const mongoose = require('mongoose');

mongoose.connect(config.dbURL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors);
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
  res.status(err.status || 500).send({message: err.message});
});

module.exports = app;
