const fs = require('fs'),
    http = require('http'),
    https = require('https'),
    express = require('express'),
    alert = require('./alert');

module.exports.init = (app) => {

    let server = http.createServer(app).listen(process.env.PORT, error => {
        if (error) throw error
    });

    if (process.env.dev) {
        console.log(`Magic is Happening at http://localhost:${process.env.PORT}`);
        alert.sendPush("champ.sowmay@gmail.com", "link", "Jainism Tech Server Started", "http://localhost:${process.env.PORT}");
    } else {
        console.log(`Magic is Happening at https://jainism.tech`);
        alert.sendPush("champ.sowmay@gmail.com", "link", "Jainism Tech Server Started", "https://jainism.tech");
    }

}