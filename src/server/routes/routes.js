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
    res.send('404 URL Not Found');
});

module.exports = router;