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
            screen_name: data.screen_name,
            email: data.email,
            birthdate,
            language: data.language,
            timezone,
            avatar: data.avatar,
            blurb: data.blurb ? data.blurb : null,
            loggedUser
        })
    });
}

module.exports.editUserInfo = (req, res, next) => {
    console.log("edit user info")
    const { User } = req.app.get('models');
    User.findById(req.session.passport.user.id, {raw: true})
    .then( (data) => {
        console.log("data", data)
        return User.update({
        screen_name: req.body.screen_name ? req.body.screen_name : data.screen_name,
        email: req.body.email ? req.body.email : data.email,
        password: data.password,
        birthdate: data.birthdate,
        language: req.body.language ? req.body.language : data.language,
        timezone: req.body.timezone ? req.body.timezone : data.timezone,
        avatar: req.body.avatar ? req.body.avatar : data.avatar,
        last_logged_in: data.last_logged_in,
        blurb: req.body.blurb ? req.body.blurb : data.blurb,
        }, {where: {id: req.session.passport.user.id}})
    })
    .then( (data1) => {
        console.log("data1", data1)
        res.redirect(`/user/${req.session.passport.user.id}`)
    });
}
// buyer_id:req.session.passport.user.id,
// payment_id: req.body.payment_id,
// order_date: req.body.order_date,
// createdAt:null,
// updatedAt:null
// }, {where:{id: req.params.id}})


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