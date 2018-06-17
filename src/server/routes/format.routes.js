const express = require('express'),
router = express.Router(),
    jsdom = require("jsdom"),
    { JSDOM } = jsdom;

var db;
router.use((req, res, next) => {
    db = req.app.locals.db;
    next();
});

function sessionCheck(req, res, next) {
	if (req.session.bool == true) {
		next();
	} else {
		res.redirect('/auth');
	}
}

router.get('/', sessionCheck, (req, res) => {
	var scriptureCode = req.query.scripture;
	var page = req.query.page;
	if (scriptureCode && page) {
		db.collection('scripture').doc(scriptureCode).collection('final').doc(page).get().then(doc => {
			if (!doc.exists) {
				res.render('format.njk');
			} else {
				res.render('format.njk', {
					content: doc.data().content
				});
			}
		}).catch(err => {
			res.send({
				status: false,
				message: 'error while fetching data from finalshastra.'
			});
		});
	} else {
		res.render('format.njk');
	}
});

router.post('/save', sessionCheck, (req, res) => {
	var data = req.body;
	let [scriptureCode , page, content] = [data.scripture , data.page, data.content];
	if (scriptureCode && page && content.length > 0) {
		var timeString = String(new Date().getTime());
		var scriptreRef = db.collection('scripture').doc(scriptureCode);
		scriptreRef.collection('draft').doc(timeString).set({
			page: Number(page),
			content: content
		}).then(ref => {
			console.log(`Draft - ${scriptureCode} - ${page}`);
			scriptreRef.collection('final').doc(page).set({
				LastUpdated: (new Date()).getTime(),
				content: content
			}, {merge: true}).then(ref => {
				console.log(`Final - ${scriptureCode} - ${page}`);
				res.send({
					status: true
				});
			}).catch(err2 => {	
				console.log('error while saving final shastra data.', err2);
				res.send({
					status: false,
					message: 'error while saving final shastra data.'
				});
			});
		})
	} else {
		res.send({
			status: false,
			message: 'All the fields are required.'
		})
	}
});

module.exports = router;