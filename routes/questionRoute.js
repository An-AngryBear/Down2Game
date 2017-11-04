'use strict';

const { Router } = require('express');
const router = Router();

const { getUserAnswers, getQuestions, getAnswers, postUserAnswer } = require('../controllers/questionCtrl')

router.get('/user/:id/questions', isLoggedIn, getQuestions, getAnswers, getUserAnswers);
router.post('/user/:id/questions', isLoggedIn, postUserAnswer);

// log in authentication
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

module.exports = router;
