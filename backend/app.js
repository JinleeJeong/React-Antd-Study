var createError = require('http-errors');
const cors = require('cors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var body = require('body-parser');
var app = express();

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
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

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
