'use strict';

const express = require('express'),
	nunjucks = require('nunjucks'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	compression = require('compression'),
	admin = require('firebase-admin'),
    path = require('path');

const network = require('./src/server/modules/network'),
	alert = require('./src/server/modules/alert'),
	scheduler = require('./src/server/modules/scheduler');

const routes = require('./src/server/routes/routes'),
	shastraRoutes = require('./src/server/routes/shastra.routes'),
	formatRoutes = require('./src/server/routes/format.routes');

if (!process.env.FIREBASE_KEYS) {
	// console.error("$FIREBASE_KEYS environment variable not set");
	process.env.FIREBASE_KEYS = './firebase.json';
	process.env.dev = true;
}

if (!process.env.PORT) {
    console.error("$PORT is not specified! Starting a server at 5000");
    process.env.PORT = 5000;
}

// The application requires FIREBASE_KEYS to initialise database. 
// This can not be started by someone who doesn't has those keys because everything in request handler expects to have a database connection.
// So, I suggest two options, 
// Either hand out FIREBASE_KEYS to everyone who wants to contribute 
// Rewrite everything in a way to mock/disable Firebase database when testing it locally. 
const serviceAccount = require(path.resolve(process.env.FIREBASE_KEYS));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://jainismtech.firebaseio.com"
});

const db = admin.database();

// initializing different instances on the server
const app = express();
app.locals.db = db;
network.init(app);
alert.init();
scheduler.init(db);

app.set('trust proxy', true);

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(compression());

// Remove x-powered-by header from responses
app.disable('x-powered-by');

app.use(express.static(path.join(__dirname, 'src/client/public'), {
	maxAge: '750h'
}));

var routePath = '';
for (var i = 0; i < 7; i++) {
	routePath += `/:id${i}`;
    app.use(routePath, express.static(path.join(__dirname, 'src/client/public'), {
		maxAge: '750h',
		redirect: false // to remove slash '/' from the last of url
	}));
}

app.use('/s', shastraRoutes);
app.use('/format', formatRoutes);
app.use('/', routes);

nunjucks.configure('./src/client/views', {
	autoescape: false,
	express: app
});

app.set('view engine', 'nunjucks');

exports.module = app;