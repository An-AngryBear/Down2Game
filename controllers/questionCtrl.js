'use strict';

module.exports.getUserAnswers = (req, res, next) => {
    const { User } = req.app.get('models');
    User.findById(req.session.passport.user.id)
    .then( (user) => {
        user.getAnswers({raw: true})
        .then( (data) => {
            console.log(data);
            res.render('questions', {
                userId: req.session.passport.user.id,
                viewedUser: req.params.id
            });
        });
    });
}

module.exports.getQuestions = (req, res, next) => {
    const { Question } = req.app.get('models');
    Question.findAll( {raw:true} )
    .then( (questions) => {
        console.log("questions", questions)
        res.locals.questions = questions;
        next();
    });
}

module.exports.getAnswers = (req, res, next) => {
    const { Answer } = req.app.get('models');
    Answer.findAll( {raw:true} )
    .then( (answers) => {
        console.log("answers", answers)
        res.locals.answers = answers;
        next();
    });
}