var cookieParser = require('cookie-parser');
var createError = require('http-errors');
var express = require('express');
var LocalStrategy = require('passport-local').Strategy;
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var path = require('path');

var indexRouter = require('./app_server/routes/index');
var usersRouter = require('./app_server/routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server' ,'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
  secret: 'agilewebproject',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// define the route files that are going to be used containing the endpoints
app.use('/', indexRouter);
app.use('/users', usersRouter);

// passport config
var Account = require('./app_server/models/account');
passport.use(new LocalStrategy({ 
  usernameField: 'email',
  passwordField: 'password'
}, Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

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
  res.render('error');
});

require('./app_server/models/db');
module.exports = app;
