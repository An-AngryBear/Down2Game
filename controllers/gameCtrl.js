'use strict';

const passport = require('passport');

module.exports.getStoredGames = (req, res, next) => {
    console.log("getStoredGames")
    const { Game } = req.app.get('models');
    Game.findAll({raw:true})
    .then( (data) => {
        res.locals.storedGames = data;
        next()
    })
}

module.exports.checkGames = (req, res, next) => {
    console.log("checkgames");
    console.log("locals", res.locals.storedGames)
    
}

module.exports.postUserGame = (req, res, next) => {
    console.log("post user game");
    const { User, Game } = req.app.get('models');
    User.addGame(req.body.game)
    .then( (data) => {
        console.log(data);
        res.redirect(`/user/${req.session.passport.user.id}`);
    })
}