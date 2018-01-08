'use strict';

let request = require('request');
const passport = require('passport');
// let { igdb } = require('../public/values/igdb-config');

//gets all stored games and sets to res.locals.storedGames, passes to next method
module.exports.getStoredGames = (req, res, next) => {
    const { Game } = req.app.get('models');
    Game.findAll({raw:true})
    .then( (data) => {
        res.locals.storedGames = data;
        return next();
    })
    .catch( (err) => {
        return next(err);
    });
};

//gets the user's games and sets to res.locals.userGames, passes to next method
module.exports.getUserGames = (req, res, next) => {
    const { User } = req.app.get('models');    
    User.findById(req.params.id)
    .then( (user) => {
        return user.getGames({raw:true});
    })
    .then( (data) => {
        res.locals.userGames = data;
        return next();
    })
    .catch( (err) => {
        return next(err);
    });
};

module.exports.checkGames = (req, res, next) => {
    res.status(200).end();
};

//Looks through IGDB API to find multiplayer games that match the user's search query
module.exports.getIGDBgames = (req, res, next) => {
    let searchTerm = req.params.searchTerm;
    let options = {
        url: `https://api-2445582011268.apicast.io/games/?search=${searchTerm}&fields=name,platforms,game_modes&filter[game_modes][eq]=2&filter[version_parent][not_exists]=1&filter[release_dates.platform][any]=48,49,6,130,12,41,9`,
        headers: {
            'Accept': 'application/json',
            'user-key': process.env.IGDB_KEY
        }
    };
    request.get(options, function(error, igdbRes, body) {
        res.locals.igdbResults = body;
        res.status(200).send(body);
    });
};
//looks for game in DB, if not there: creates new tow in GAMES, and adds user-game association.
//if there: adds user-game association
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
            return User.findById(req.session.passport.user.id);
        })
        .then( (user) => {
            return user.addGame(gameId);
        })
        .then( (data) => {
            return res.redirect(`/user/${req.session.passport.user.id}`);
        })
        .catch( (err) => {
            return next(err);
        });
    } else {
        User.findById(req.session.passport.user.id)
        .then( (user) => {
            gameId = savedGames.filter( (game) => {
                if(game.name === req.body.game) {
                    return game.id;
                }
            });
            return user.addGame(gameId[0].id);
        })
        .then( (data) => {
            return res.redirect(`/user/${req.session.passport.user.id}`);
        })
        .catch( (err) => {
            return next(err);
        });    
    }
};
