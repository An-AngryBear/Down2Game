'use strict';

const express = require('express');
var helmet = require('helmet')
const app = express();
var http = require('http').Server(app);
const passport = require('passport')
var session = require('express-session');
var methodOverride = require('method-override')
let bodyParser = require('body-parser');
const flash = require('express-flash');
let pg = require('pg');
var io = require('socket.io')(http);

require('dotenv').config();
const port = process.env.PORT || 4000;

//security
app.use(helmet())

//content security policy
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'unsafe-inline'", "'self'"],
    imgSrc: ['*'],
    connectSrc: ["'self'", 'ws:', 'https://cors-anywhere.herokuapp.com']
  }
}));

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
app.use('/node_modules', express.static(__dirname + '/node_modules'));

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
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({limit: '50mb'}));
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

var server = app.listen(process.env.PORT || 3000);
var io = require('socket.io').listen(server);
var clients = {};

io.on('connection', function(socket){
  console.log('**************a user connected****************');

  socket.on('add-user', function(data){
    console.log("***********ADDING USER**************")
    clients[data.userID] = {
      "socket": socket.id
    };
    console.log("**************** CLIENTS",clients, "*******************")
  });

  socket.on('private-message', function(data){
    console.log("=============Sending: " + data.content + " to " + data.userID);
    if (clients[data.userID]){
      console.log("SENT");
      io.sockets.connected[clients[data.userID].socket].emit("add-message", data);
    } else {
      console.log("===============User does not exist: " + data.userID); 
    }
  });

  //Removing the socket on disconnect
  socket.on('disconnect', function() {
  	for(var name in clients) {
  		if(clients[name].socket === socket.id) {
  			delete clients[name];
  			break;
  		}
  	}	
  });

});