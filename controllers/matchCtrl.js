'use strict';

var Sequelize = require('sequelize');
let request = require('request');
const passport = require('passport');
const Op = Sequelize.Op;

//takes the IDs of the user's answers and searches for other users who have chosen the same answers
//creates an object. the key is the answerID and the value is an array of users who have chosen that answer.
module.exports.getSimilarUsers = (req, res, next) => {
    const { User, Answer, Question, Category} = req.app.get('models');
    res.locals.userAnswerObj = {};
    let userAnswerIds = res.locals.usersAnswers.map( (answer) => {
        return answer['UserAnswers.AnswerId'];
    })
    let counter = 0;
    userAnswerIds.forEach( (id) => {
        Answer.findById(id)
        .then( (ans) => {
            return ans.getUsers({
                raw:true
            })
        })
        .then( (data) => {
            data.forEach( (obj, i) => {
                res.locals.userAnswerObj[id] ? res.locals.userAnswerObj[id].push(obj.id) : res.locals.userAnswerObj[id] = [obj.id]
            });
            counter++;
            if(counter === userAnswerIds.length) {
                next()
            }
        });
    });
}

//finalizes any database interaction and renders the matches page with user info
module.exports.renderMatchPage = (req, res, next) => {
    console.log("answerObj", res.locals.userAnswerObj);
    res.render('match', {
        userId: req.session.passport.user.id
    });
}
