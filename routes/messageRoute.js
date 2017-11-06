'use strict';

const { Router } = require('express');
const router = Router();

const { renderInbox, postNewMessage, getMessages } = require('../controllers/messagingCtrl')

router.get('/inbox', isLoggedIn, renderInbox);
router.post('/inbox/message', isLoggedIn, postNewMessage);
router.get('/inbox/message/:recipientId', isLoggedIn, getMessages);

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

module.exports = router;