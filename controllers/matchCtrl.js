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
    });
    let counter = 0;
    userAnswerIds.forEach( (id) => {
        Answer.findById(id)
        .then( (ans) => {
            return ans.getUsers({
                raw: true,
                where: {
                    id: {
                        [Op.not]: req.session.passport.user.id
                    }
                }
            });
        })
        .then( (data) => {
            data.forEach( (obj) => {
                res.locals.userAnswerObj[id] ? res.locals.userAnswerObj[id].push(obj.id) : res.locals.userAnswerObj[id] = [obj.id]
            });
            counter++;
            if(counter === userAnswerIds.length) {
                next();
            }
        });
    });
}

module.exports.matchAlgorithm = (req, res, next) => {
    const { User } = req.app.get('models');
    let answerObj = res.locals.userAnswerObj; //gets object with keys as question ids and the values are arrays of user Ids that answered the same
    console.log("answer Obj", answerObj)
    let matchedUsers = Object.values(answerObj); //pulls out all the userIDs from the object
    let countObj = {};
    let userArr = matchedUsers.reduce( (acc, cur) => {  //joins all the ids together in a large array (with duplicates for counting)
        return acc.concat(cur);
    }, []);
    for(let i = 0; i < userArr.length; i++) { //counts the instances of each userID, the result is an object with counts each user answered the same as current user
        let num = userArr[i];
        countObj[num] = countObj[num] ? countObj[num] + 1 : 1;
    }
    let matchPercent = getPercentage(countObj, res.locals.usersAnswers.length); //gets the percentages of matching => (answered-questions / total questions)
    //  TODO: only show users that have 20 questions answered;
    let usersToShow = Object.keys(matchPercent).map( (num) => { //gets all the user ids to show and converts to numbers
        return parseInt(num);
    });
    User.findAll({ 
        raw: true,
        where: {
            id: {
                [Op.in]: usersToShow //only get users if their IDs are provided
            }
        }
    })
    .then( (data) => {
        let matchAdded = data.map( (user) => { //take the percentage for each user match and stick on the user objs
            for(let key in matchPercent) {
                if( user.id == key) {
                    user.matchPercent = matchPercent[key] * 100 + "%"; //turns into a whole number and adds % symbol
                }
            }
            return user
        }).sort(function(a, b) { //sorts the users by highest match %
            return parseFloat(b.matchPercent) - parseFloat(a.matchPercent);
        });
        console.log("match added", matchAdded)
        res.locals.usersToShow = matchAdded;
        next();
    });
}

let getPercentage = (countObj, questionCount) => {
    console.log("countobj", countObj)
    for(let key in countObj) {
        countObj[key] = countObj[key] / questionCount;
    }
    return countObj;
}

//finalizes any database interaction and renders the match page with user info
module.exports.renderMatchPage = (req, res, next) => {
    res.render('match', {
        userId: req.session.passport.user.id
    });
}
