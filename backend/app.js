var createError = require('http-errors');
const cors = require('cors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var body = require('body-parser');
var app = express();
var models = require('./models/index');

var certification = require('./routes/certification');
var applist = require('./routes/applist');
var appverinfo = require('./routes/appverinfo');
var branches = require('./routes/branches');
var loginlogs = require('./routes/loginlogs');
var stlogs = require('./routes/stlogs');
var pcApi = require('./routes/pcApi');
var students = require('./routes/students');
var teachers = require('./routes/teachers');
// ------------ Connection

models.sequelize.sync().then( () => {
  console.log("✓ DB connection success.")
}).catch(err => {
  console.log("✗ DB connection error. Please make sure DB is running.")
  console.log(err)
});

app.use(logger('dev'));
app.use(express.json({limit: '16mb'}));
app.use(express.urlencoded({ limit: '16mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(body.urlencoded({
  extended: true
}));
app.use(body.json());


app.use(function(req, res, next) {

  // res.setHeader('Access-Control-Allow-Origin', 'http://ec2-54-180-81-120.ap-northeast-2.compute.amazonaws.com:8080');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use('/api', certification);
app.use('/api', applist);
app.use('/api', branches);
app.use('/api', loginlogs);
app.use('/api', stlogs);
app.use('/api', pcApi);
app.use('/api', students);
app.use('/api', teachers);
app.use('/api', appverinfo);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
