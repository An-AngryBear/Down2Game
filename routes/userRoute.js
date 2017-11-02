'use strict';

const { Router } = require('express');
const router = Router();

const { getUserInfo, editUserInfo } = require('../controllers/userCtrl')

router.put('/user', isLoggedIn, editUserInfo, getUserInfo)
router.get('/user/:id', isLoggedIn, getUserInfo)
// router.put('user/email', isLoggedIn)
// router.put('user/language', isLoggedIn)
// router.put('user/timezone', isLoggedIn)

function isLoggedIn(req, res, next) {
    console.log("isLoggedIn?")
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

module.exports = router;