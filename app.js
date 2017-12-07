'use strict';

const express = require('express');
const app = express();
const passport = require('passport')
var session = require('express-session');
var methodOverride = require('method-override')
let bodyParser = require('body-parser');
const flash = require('express-flash');
let pg = require('pg');

require('dotenv').config();
const port = process.env.PORT || 4000;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//expands the type of methods a form can submit
app.use(methodOverride('_method'));


//settings
app.set('models', require('./models'));
app.set('view engine', 'pug');

//access to public folder
app.use('/public', express.static(__dirname + '/public'));

let routes = require('./routes/');

//session persistence
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//authentication
require('./config/passport-strat.js');
app.use(passport.initialize());
app.use(passport.session());
app.use( (req, res, next) => {
  res.locals.session = req.session;
  next();
});

//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());

app.use(routes);

//error handling
app.use( (req, res, next) => {
  let error = new Error('sorry, not found.');
  error.status = 404;
  next(error);
});

app.use( (err, req, res, next) => {
  console.log(err)
  res.status(err.status||500);
  res.json({
  message:"A problem occurred.",
  err:err
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});