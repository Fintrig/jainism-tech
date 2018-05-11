const cron = require('node-cron');

var db;
module.exports.init = (fireDB) => {
    db = fireDB;
}

cron.schedule('0 * * * *', () => { // every hour
    //
});
