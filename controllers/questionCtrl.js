'use strict';
//TODO line 9 looksfor answers if you go into the user route if a user that doesnt exist,errors
//gets all the user's answers and sets it to res.locals.usersAnswers, passes to next method
module.exports.getUserAnswers = (req, res, next) => {
    const { User } = req.app.get('models');
    User.findById(req.params.id)
    .then( (user) => {
        user.getAnswers({raw: true})
        .then( (answers) => {
            let ansIds = answers.map( (answer) => {
                return answer.QuestionId;
            });
            if (res.locals.questions) {
                let nonAnswered = res.locals.questions.filter( (question) => {
                    if(ansIds.indexOf(question.id) === -1) {
                        return question
                    }
                });
                res.locals.nonAnswered = nonAnswered;
            }
            res.locals.usersAnswers = answers;
            next();
        })
        .catch( (err) => next(err));
    })
    .catch( (err) => next(err));
}

//finalizes any database interaction and renders the questions page, sets user info to res.locals
module.exports.renderQuestPage = (req, res, next) => {
    res.render('questions', {
        userId: req.session.passport.user.id,
        viewedUser: req.params.id
    });
}

//gets all possible questions and sets it to res.locals.questions, passes to next method
module.exports.getQuestions = (req, res, next) => {
    const { Question } = req.app.get('models');
    Question.findAll({raw: true})
    .then( (questions) => {
        res.locals.questions = questions;
        next();
    })
    .catch( (err) => next(err));
}

//gets all possible answers and sets it to res.locals.answers, passes to next method
module.exports.getAnswers = (req, res, next) => {
    const { Answer } = req.app.get('models');
    Answer.findAll( {raw: true} )
    .then( (answers) => {
        res.locals.answers = answers;
        next();
    })
    .catch( (err) => next(err));
}

//posts user's answers
module.exports.postUserAnswer = (req, res, next) => {
    const { User } = req.app.get('models');
    let userObj;
    let questions = res.locals.questions;
    let answerIds;
    User.findById(req.session.passport.user.id)
    .then( (user) => {
        userObj = user;
        return userObj.getAnswers({raw: true}) //get user-answers
    })
    .then( (answers) => {
        answerIds = answers.map( (answer) => { //get IDs of answers
            return +answer.id;
        })
        return getIdToRemove(answers, req, userObj)
    })
    .then( (idToRemove) => {
        if(idToRemove) { //if the qeustion has already been answered
            userObj.removeAnswer(+idToRemove.id) //remove the answer
            .then( () => {
                userObj.addAnswer(+req.body.AnswerId) //then add the new answer
                .then( () => {
                    res.status(200).end();
                })
                .catch( (err) => next(err));
            })
            .catch( (err) => next(err));
        } else {
            userObj.addAnswer(+req.body.AnswerId) //if the question hasn't been answered, add the answer
            .then( () => {
                res.status(200).end();
            })
            .catch( (err) => next(err));
        }
    })
    .catch( (err) => next(err));
}


let getIdToRemove = (answers, request, userObj) => {
    return new Promise( (resolve, reject) => {
        let idToRemove = answers.filter( (answerObj) => {
            if(+answerObj.QuestionId === +request.body.QuestionId) {
                return +answerObj.id
            }
        })
        resolve(idToRemove[0])
    })
}

        