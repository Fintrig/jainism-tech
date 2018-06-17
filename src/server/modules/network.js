const http = require('http'),
    alert = require('./alert');

module.exports.init = (app) => {
    let port = 5000;
    http.createServer(app).listen(port, error => {
        if (error) throw error
    });
    console.log(`Magic is Happening at https://jainism.tech OR http://localhost:${port}`);
    alert.sendPush("champ.sowmay@gmail.com", "text", "Jainism Tech Server Started", ":)");
}