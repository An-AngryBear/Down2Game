'use strict';

const { Router } = require('express');
const router = Router();

const { getStoredGames, checkGames, postUserGame } = require('../controllers/gameCtrl')

router.get('/games', isLoggedIn, getStoredGames, checkGames)
router.post('/games', isLoggedIn, postUserGame);

function isLoggedIn(req, res, next) {
    console.log("isLoggedIn?")
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

module.exports = router;



