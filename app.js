'use strict';

const express = require('express'),
	nunjucks = require('nunjucks'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	compression = require('compression'),
	session = require('client-sessions'),
	admin = require('firebase-admin'),
    path = require('path');

const network = require('./src/server/modules/network'),
	alert = require('./src/server/modules/alert'),
	scheduler = require('./src/server/modules/scheduler');

const routes = require('./src/server/routes/routes'),
	scriptureRoutes = require('./src/server/routes/scripture.routes'),
	authRoutes = require('./src/server/routes/auth.routes'),
	formatRoutes = require('./src/server/routes/format.routes');

if (!process.env.FIREBASE_KEYS) {
	process.env.FIREBASE_KEYS = './firebase.json';
}

const serviceAccount = require(path.resolve(process.env.FIREBASE_KEYS));
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// initializing different instances on the server
const app = express();
app.locals.db = db;
network.init(app);
alert.init();
scheduler.init(db);

app.set('trust proxy', true);

app.use(cookieParser());

// https://stackoverflow.com/questions/19917401/error-request-entity-too-large
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

app.use(compression());

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

app.use(session({
	cookieName: 'session',
	secret: 'iugwhjsn765ui6o7s8k8d9mc4o3wi3j34h4b5e6d77nk8os8i9j9hdbcnj',
	duration: 30 * 24 * 60 * 60 * 1000, // 30 days
	activeDuration: 5 * 60 * 1000 // 5 minutes
}));

app.use('/s', scriptureRoutes);
app.use('/format', formatRoutes);
app.use('/auth', authRoutes);
app.use('/', routes);

nunjucks.configure('./src/client/views', {
	autoescape: false,
	express: app
});

app.set('view engine', 'nunjucks');

exports.module = app;