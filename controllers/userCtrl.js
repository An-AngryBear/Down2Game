'use strict'

//get user info for display in profile
module.exports.getUserInfo = (req, res, next) => {
    console.log("get user info")
    const { User } = req.app.get('models');
    User.findById(req.params.id, { raw: true })
    .then( (data) => {
        let birthdate = dateConverter(data.birthdate);
        let timezone = timezoneTextParser(data.timezone);
        let loggedUser;
        req.params.id == req.session.passport.user.id ? loggedUser = true : loggedUser = false
        res.render('profile', {
            screenName: data.screenName,
            email: data.email,
            birthdate,
            language: data.language,
            timezone,
            avatar: data.avatar,
            blurb: data.blurb ? data.blurb : null,
            loggedUser,
            storedGames: res.locals.storedGames,
            userId: req.session.passport.user.id,
            viewedUser: req.params.id
        })
    })
    .catch( (err) => {
        return next(err);
    });
}

module.exports.getUserId = (req, res, next) => {
    res.redirect(`/user/${req.session.passport.user.id}`);
}

// multi use function for editing any of the user info one at a time
module.exports.editUserInfo = (req, res, next) => {
    const { User } = req.app.get('models');
    User.findById(req.session.passport.user.id, {raw: true})
    .then( (data) => {
        return User.update({
        screenName: req.body.screenName ? req.body.screenName : data.screenName,
        email: req.body.email ? req.body.email : data.email,
        password: data.password,
        birthdate: data.birthdate,
        language: req.body.language ? req.body.language : data.language,
        timezone: req.body.timezone ? req.body.timezone : data.timezone,
        avatar: req.body.avatar ? req.body.avatar : data.avatar,
        lastLoggedIn: data.lastLoggedIn,
        blurb: req.body.blurb ? req.body.blurb : data.blurb,
        }, {where: {id: req.session.passport.user.id}})
    })
    .then( (data1) => {
        res.redirect(`/user/${req.session.passport.user.id}`)
    })
    .catch( (err) => {
        return next(err);
    });
}

//converts long date to xx/xx/xxxx format
let dateConverter = (date) => {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();
    let newDate = `${month}/${day}/${year}`;
    return newDate;
}

//removes the -xx:xx or +xx:xx from the timezone string, leaving just the zone-title
let timezoneTextParser = (timezoneString) => {
    let timezoneArr = timezoneString.split(/[0-9]+/);
    return timezoneArr[2];
}

module.exports.getScreenName = (req, res, next) => {
    console.log("get screen name");
    const { User } = req.app.get('models');
    User.findById(req.params.id)
    .then( (data) => {
        console.log(data.screenName);
        res.send(data.screenName);
    })
    .catch( (err) => {
        return next(err);
    });
}