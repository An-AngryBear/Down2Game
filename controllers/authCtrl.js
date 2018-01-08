'use strict';

const passport = require('passport');

// creating new users
module.exports.displayRegister = (req, res) => {
  res.render('register');
};

module.exports.register = (req, res, next) => {
    if (req.body.password === req.body.confirmation) {
        passport.authenticate('local-signup', (err, user, msgObj) => { //pipes through passport strategy
          if (err) { 
            console.log(err); 
          }
          if (!user) { 
              return res.render('register', {msg: msgObj.message}); 
          }
          req.logIn(user, (err) => { //logs user in
              if (err) { return next(err); }
              req.flash('registerMsg', `Welcome to Down2Game, ${user.screen_name}!`);
              res.redirect(`/user/${req.session.passport.user.id}`);
          });
        })(req, res, next);
    } else {
    res.render('register', { message: 'Password & password confirmation do not match' });
    }
};

// logging in existing users
module.exports.displayLogin = (req, res, next) => {
  res.render('login');
};

module.exports.login = (req, res, next) => {
  passport.authenticate('local-signin', (err, user, msgObj) => {
    if (err) { console.log(err); }
    if (!user) {
      return res.render('login', msgObj);
    }
    req.logIn(user, err => {
      if (err) { return next(err); }
      req.flash('welcomeBackMsg',`Welcome back, `);
      res.redirect(`/user/${req.session.passport.user.id}`);
    });
  })(req, res, next);
};

// logging out
module.exports.logout = (req, res) => {
  req.session.destroy(function(err) {
    res.redirect('/');
  });
};
