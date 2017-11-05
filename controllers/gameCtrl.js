'use strict';

let request = require('request');
const passport = require('passport');
let { igdb } = require('../public/values/igdb-config');

module.exports.getStoredGames = (req, res, next) => {
    const { Game } = req.app.get('models');
    Game.findAll({raw:true})
    .then( (data) => {
        res.locals.storedGames = data;
        next();
    });
}

module.exports.getUserGames = (req, res, next) => {
    const { User } = req.app.get('models');    
    User.findById(req.session.passport.user.id)
    .then( (user) => {
        user.getGames({raw:true})
        .then( (data) => {
            res.locals.userGames = data;
            next();
        });
    });
}

module.exports.checkGames = (req, res, next) => {
    console.log("locals", res.locals.storedGames)
    res.status(200).end();
}

module.exports.getIGDBgames = (req, res, next) => {
    let searchTerm = req.params.searchTerm;
    let options = {
        url: `https://api-2445582011268.apicast.io/games/?search=${searchTerm}&fields=name,game_modes&filter[game_modes][eq]=2&filter[version_parent][not_exists]=1`,
        headers: {
            'Accept': 'application/json',
            'user-key': igdb().key
        }
    }
    request.get(options, function(error, igdbRes, body) {
        res.locals.igdbResults = body;
        res.status(200).send(body);
    });
}

module.exports.postUserGame = (req, res, next) => {
    const { User, Game } = req.app.get('models');
    let savedGames = res.locals.storedGames;
    let gameNames = savedGames.map( (game) => {
        return game.name;
    });
    let gameId;
    if(gameNames.indexOf(req.body.game) === -1) {
        Game.create({
            name: req.body.game
        })
        .then( (data) => {
            gameId = data.dataValues.id;
            return User.findById(req.session.passport.user.id)
        })
        .then( (user) => {
            return user.addGame(gameId);
        })
        .then( (data) => {
            res.redirect(`/user/${req.session.passport.user.id}`)
        })
    } else {
        User.findById(req.session.passport.user.id)
        .then( (user) => {
            gameId = savedGames.filter( (game) => {
                if(game.name === req.body.game) {
                    return game.id
                }
            });
            return user.addGame(gameId[0].id)
        })
        .then( (data) => {
            res.redirect(`/user/${req.session.passport.user.id}`)
        })
    }
}
