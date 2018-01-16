'use strict';

let request = require('request');
const passport = require('passport');
// let { igdb } = require('../public/values/igdb-config');

//gets all stored games and sets to res.locals.storedGames, passes to next method
module.exports.getStoredGames = (req, res, next) => {
    const { Game } = req.app.get('models');
    Game.findAll({raw:true})
    .then( (data) => {
        console.log(data);
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
        let filteredGames = platformFilter(body);
        res.locals.igdbResults = filteredGames;
        res.status(200).send(filteredGames);
    });
};

let divideByPlatform = (arrOfGames) => {
    let dividedGames = [];
    for(let i = 0; i < arrOfGames.length; i++) {
        for(let p = 0; p < arrOfGames[i].platforms.length; p++) {
            let game = {};
            game.name = arrOfGames[i].name;
            game.platform = arrOfGames[i].platforms[p];
            dividedGames.push(game);
        }
    }
    return dividedGames;
}

//6,49,48,130,12,9 filter through array of game 
let platformFilter = (body) => {
    let suppPlats = [6, 49, 48, 130, 12, 9];
    let arr = JSON.parse(body);
    let filteredGames = arr.filter( (game) => {
        if(game.platforms) {
            return game.platforms.some(isSupportedPlatform)
        }
    }).map( (g) => {
        let platforms = [];
        for(let i = 0; i < g.platforms.length; i++) {
            if(suppPlats.indexOf(g.platforms[i]) > -1) {
                platforms.push(g.platforms[i]);
            }
        }
        g.platforms = platforms;
        return g;
    });
    return divideByPlatform(filteredGames);
};

let isSupportedPlatform = (num) => {    
    return num === (6 || 49 || 48 || 130 || 12 || 9);
};

//looks for game in DB, if not there: creates new tow in GAMES, and adds user-game association.
//if there: adds user-game association
module.exports.postUserGame = (req, res, next) => {
    const { User, Game } = req.app.get('models');
    let savedGames = res.locals.storedGames;
    let storedGames = savedGames.reduce( (acc, cur) => {
        acc[cur.name] = cur.platform;
        return acc;
    }, {});
    let gameId;
    let stored = false;
    for(let key in storedGames) {
        if(req.body.gameName === key && req.body.platform == storedGames[key] ) {
            stored = true;
        }
    }
    let gameNames;

    if(!stored) {
        console.log("==========NOT STORED TRIGGER============");
        Game.create({
            name: req.body.gameName,
            platform: req.body.platform
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
        console.log("========STORED TRIGGER==========")
        User.findById(req.session.passport.user.id)
        .then( (user) => {
            gameId = savedGames.filter( (game) => {
                if(game.name === req.body.gameName) {
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
