const express = require('express'),
    router = express.Router(),
    jsdom = require("jsdom"),
    { JSDOM } = jsdom;

var db;
router.use((req, res, next) => {
    db = req.app.locals.db;
    next();
});

router.get('/', (req, res) => {
    console.log(req.session.bool, typeof req.session.bool);
    if (req.session.bool === true) {
        res.redirect('/format');
    } else {
        var passcode = req.query.passcode;
        var user = req.query.user;
        if (passcode === 'SwadhyayKaro' && user) {
            console.log(passcode, user);
            req.session.bool = true;
            req.session.user = user;
            res.redirect('/format');
        } else {
            res.send('Create session to access previous page.');
        }
    }
});

router.get('/logout', (req, res) => {
    req.session.reset();
    res.redirect('/');
});

module.exports = router;