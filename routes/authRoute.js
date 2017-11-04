'use strict';

const { Router } = require('express');
const router = Router();
const {
  displayRegister,
  register,
  displayLogin,
  login,
  logout
} = require('../controllers/authCtrl.js');

// new users
router.get('/register', displayRegister);
router.post('/register', register);

// login existing users
router.get('/login', displayLogin);
router.post('/login', login);

router.get('/logout', logout);

// log in authentication
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/login');
}

module.exports = router;