'use strict';

const { Router } = require('express');
const router = Router();

const { getUserInfo, editUserInfo, getUserId, getScreenName, saveProfileImg } = require('../controllers/userCtrl');
const { getStoredGames, getIGDBgames, getUserGames } = require('../controllers/gameCtrl');
const { getUserAnswers, getQuestions } = require('../controllers/questionCtrl');
const { renderMatchPage, getSimilarUsers, matchAlgorithm } = require('../controllers/matchCtrl');


router.put('/user', isLoggedIn, editUserInfo, getStoredGames, getUserInfo);
router.put('/user/images', isLoggedIn, saveProfileImg, editUserInfo);
router.get('/user/:id', isLoggedIn, getStoredGames, getQuestions, getUserAnswers, getUserGames, getUserInfo);
router.get('/user/:id/screenname', isLoggedIn, getScreenName);
router.get('/user/:id/matches',isLoggedIn, isLoggedUser, getUserAnswers, getSimilarUsers, matchAlgorithm, renderMatchPage); //getUsers, getUserAnswers
router.get('/user/:id/:searchTerm', isLoggedIn, getIGDBgames);
router.get('/user', isLoggedIn, getUserId);

function isLoggedUser(req, res, next) {
    if(req.params.id == req.session.passport.user.id) {
        return next();
    }
    res.redirect(`/user/${req.session.passport.user.id}/matches`);
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

module.exports = router;


//getusers who have answered all the qeustions, have at least one similar answer