'use strict';

const express = require('express');
const app = express();
const passport = require('passport')
var session = require('express-session');
var methodOverride = require('method-override')
let bodyParser = require('body-parser');
const flash = require('express-flash');

require('dotenv').config();
const port = process.env.PORT || 4000;

//expands the type of methods a form can submit
app.use(methodOverride('_method'));

//access to public folder
app.use(express.static(__dirname + '/public'));

//settings
app.set('models', require('./models'));
app.set('view engine', 'pug');

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

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});