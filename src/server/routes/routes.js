const express = require('express'),
    router = express.Router();

var db;
router.use((req, res, next) => {
    db = req.app.locals.db;
    next();
});

router.get('/', (req, res) => {
    res.render('home.njk');
});

router.get('*', (req, res) => {
    res.redirect('/');
});

module.exports = router;
