'use strict';

var Sequelize = require('sequelize');
const Op = Sequelize.Op;

//finalizes any database interaction and renders the match page with user info
module.exports.renderInbox = (req, res, next) => {
    console.log("latest messages", res.locals.latestMessages)
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

module.exports.getUserInformation = (req, res, next) => {
    const { User } = req.app.get('models');
    User.findAll({
        raw:true,
        where: {
            id: {
                [Op.in]: res.locals.userList
            }
        }
    })
    .then( (users) => {
        console.log("users", users)
        res.locals.userMsgObjs = res.locals.latestMessages.forEach( (message) => {
            for(let i = 0; i < users.length; i++) {
                if(users[i].id === message.senderId) {
                    message.screenName = users[i].screenName;
                } else if ( users[i].id === message.recipientId) {
                    message.screenName = users[i].screenName;
                }

            }
        })
        console.log("HELLLLLLLO", res.locals.latestMessages)
        next();
    });
    
}

module.exports.getInbox = (req, res, next) => {
    const { Message, User } = req.app.get('models');
    Message.findAll({
        raw:true,
        where: {
            [Op.or]: [
                { senderId: req.session.passport.user.id },
                { recipientId: req.session.passport.user.id }
            ]
        }
    })
    .then( (messages) => {
        res.locals.userList = getUserMessageList(req.session.passport.user.id, messages);
        res.locals.latestMessages = [];
        for(let i = 0; i < res.locals.userList.length; i++) {
            Message.findAll({
                raw: true,
                where: {
                    [Op.or]: [
                        {
                            senderId: req.session.passport.user.id,
                            recipientId: res.locals.userList[i]
                        },
                        {
                            senderId: res.locals.userList[i],
                            recipientId: req.session.passport.user.id
                        }
                    ]
                }
            })
            .then( (userMsgs) => {
                let latestMessage = userMsgs.reduce(function (a, b) { return a.createdAt > b.createdAt ? a : b; });
                res.locals.latestMessages.push(latestMessage);
                console.log(i, res.locals.userList.length)
                if(i === res.locals.userList.length - 1) {
                    next()
                }
            });
        }
    });
}

//a list of the last messsages sent between two users for each user that has messaged

let getUserMessageList = (currentUser, messages) => {
    let uniqueUsers = messages.reduce( (acc, cur) => {
        acc.push(cur.senderId)
        return acc;
    }, [])
    .filter( (userId, i, arr) => {
        if(userId !== currentUser) {
            return arr.indexOf(userId) == i;
        }
    });
    console.log("uniqueUsers??", uniqueUsers)
    return uniqueUsers
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