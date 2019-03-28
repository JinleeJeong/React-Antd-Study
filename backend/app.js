var createError = require('http-errors');
const cors = require('cors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var body = require('body-parser');
var app = express();

var models = require('./models/index');

var admins = require('./routes/admins');
var applist = require('./routes/applist');
var appverinfo = require('./routes/appverinfo');
var branches = require('./routes/branches');
var loginlogs = require('./routes/loginlogs');
var stlogs = require('./routes/stlogs');
var stsettings = require('./routes/stsettings');
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

  //모든 도메인의 요청을 허용하지 않으면 웹브라우저에서 CORS 에러를 발생시킨다.
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

app.use('/api/sp/', admins);
app.use('/api/sp/', applist);
app.use('/api/sp/', appverinfo)
app.use('/api/sp/', branches);
app.use('/api/sp/', loginlogs);
app.use('/api/sp/stlogs', stlogs);
app.use('/api/sp/', stsettings);
app.use('/api/sp/', students);
app.use('/api/sp/', teachers);



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