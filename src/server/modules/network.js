const fs = require('fs'),
    http = require('http'),
    https = require('https'),
    express = require('express'),
    alert = require('./alert');

module.exports.init = (app) => {
       
    // HTTPS and redirection is handled by nginx server
    // Keep this disabled until you actually need it
    // Debug port has been changed to 5000 
    // which is what nginx uses. 
    if (false) {

        let options = {
            key: fs.readFileSync('/etc/letsencrypt/live/jainism.tech/privkey.pem'),
            ca: fs.readFileSync('/etc/letsencrypt/live/jainism.tech/chain.pem'),
            cert: fs.readFileSync('/etc/letsencrypt/live/jainism.tech/fullchain.pem')
        }

        http.createServer(app).listen(5000, error => {
            if (error) throw error
            console.log("Magic is Happening at http://jainism.tech");
        });

        let server = https.createServer(options, app).listen(443, error => {
            if (error) throw error
            console.log("Magic is Happening at https://jainism.tech");
        });

        alert.sendPush("champ.sowmay@gmail.com", "link", "Jainism Tech Server Started", "jainism.tech");

    } else {

        let server = http.createServer(app).listen(process.env.PORT, error => {
            if (error) throw error
            console.log(`Magic is Happening at http://localhost:${process.env.PORT}`);
        });

        alert.sendPush("champ.sowmay@gmail.com", "link", "Jainism Tech Server Started", "localhost");

    }

}
