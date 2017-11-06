'use strict';

var Sequelize = require('sequelize');
const Op = Sequelize.Op;

//finalizes any database interaction and renders the match page with user info
module.exports.renderInbox = (req, res, next) => {
    res.render('inbox', {
        userId: req.session.passport.user.id
    });
}

module.exports.postNewMessage = (req, res, next) => {
    console.log("sendMessage", req.body)
    res.json(req.body);
    const { Message } = req.app.get('models');
    Message.create({
        msgContent: req.body.msgContent,
        senderId: req.session.passport.user.id,
        recipientId: req.body.recipientId,
        request: req.body.request
    })
    .then( (data) => {
        res.status(200).end();
        console.log("message created");
    });
}

module.exports.getMessages = (req, res, next) => {
    const { Message, User } = req.app.get('models');
    Message.findAll({
        raw: true,
        where: {
            [Op.or]: [
                {
                    senderId: req.session.passport.user.id,
                    recipientId: req.params.recipientId
                },
                {
                    senderId: req.params.recipientId,
                    recipientId: req.session.passport.user.id
                }
            ]
        },
        order: [ ['createdAt'] ]
    })
    .then( (data) => {
        console.log("messages?", data);
        res.status(200).send(data);
    });
}