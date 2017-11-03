'use strict';

const { Router } = require('express');
const router = Router();

const { getUserInfo, editUserInfo } = require('../controllers/userCtrl')
const { getStoredGames } = require('../controllers/gameCtrl')

router.put('/user', isLoggedIn, editUserInfo, getStoredGames, getUserInfo)
router.get('/user/:id', isLoggedIn, getStoredGames, getUserInfo)
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