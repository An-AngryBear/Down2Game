'use strict';

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
        });
    });
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
    });
}

//gets all possible answers and sets it to res.locals.answers, passes to next method
module.exports.getAnswers = (req, res, next) => {
    const { Answer } = req.app.get('models');
    Answer.findAll( {raw: true} )
    .then( (answers) => {
        res.locals.answers = answers;
        next();
    });
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
        return userObj.getAnswers({raw: true})
    }).then( (answers) => {
        answerIds = answers.map( (answer) => {
            return +answer.id;
        })
        return deleteExistingAnswer(answers, req, userObj)
    }).then( (idToRemove) => {
        if(idToRemove) {
            console.log("got something to remove")
            userObj.removeAnswer(+idToRemove.id)
            .then( () => {
                userObj.addAnswer(+req.body.AnswerId)
                .then( () => {
                    console.log("addcomplete")
                    if(res.locals.nonAnswered.length === 1) {
                        res.status(200).redirect(`user/${req.session.passport.user.id}/questions`)
                    } else {
                        res.status(200).end();
                    }
                });
            });
        } else {
            console.log("nothing to remove")
            userObj.addAnswer(+req.body.AnswerId)
            .then( () => {
                console.log("addcomplete")
                if(res.locals.nonAnswered.length === 1) {
                    res.status(200).redirect(`user/${req.session.passport.user.id}/questions`)
                } else {
                    res.status(200).end();
                }
            });
        }
    });
}

let deleteExistingAnswer = (answers, request, userObj) => {
    return new Promise( (resolve, reject) => {
        let idToRemove = answers.filter( (answerObj) => {
            console.log("answers FOr each", +answerObj.id, +answerObj.QuestionId, +request.body.QuestionId)
            if(+answerObj.QuestionId === +request.body.QuestionId) {
                console.log("removing", +answerObj.id )
                return +answerObj.id
            }
        })
        resolve(idToRemove[0])
    })
}
// else {
//     console.log("exists");
//     userObj.setAnswers([req.body.AnswerId])
//     .then( () => {
//         console.log("setcomplete");
//         res.status(200);
//     });
// }

        