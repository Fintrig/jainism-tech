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
	var shastra = req.query.shastra;
	var page = req.query.page;
	if (shastra && page) {
		db.collection('finalShastra').where('code', '==', shastra).get().then(snapshot => {
			if (snapshot.empty) {
                res.render('format.njk');
            } else {
                snapshot.forEach((doc) => {
                    res.render('format.njk', {
						content: doc.data().content
					});
                })
            }
		}).catch(err => {
			res.send({
				status: false,
				message: 'error while fetching data from finalshastra.'
			});	
			console.log('Error getting shastra data', err);
		});
	} else {
		res.render('format.njk');
	}
});

router.post('/save', sessionCheck, (req, res) => {
	var data = req.body;
	let [shastra , page, content] = [data.shastra , data.page, data.content];
	if (shastra && page && content.length > 0) {
		db.collection('shastraDraft').doc('draft').collection(shastra).add({
			time: (new Date()).getTime(),
			page: Number(page),
			content: content
		}).then(draftRef => {
			console.log(`Draft (${draftRef}) - ${shastra} - ${page}`);
			db.collection('finalShastra').doc(shastra).set({
				time: (new Date()).getTime(),
				page: Number(page),
				code: shastra,
				content: content
			}).then(finalRef => {
				console.log(`Final (${finalRef}) - ${shastra} - ${page}`);
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
		// .catch(err => {
		// 	console.log('error while saving draft shastra data', err);
		// 	res.send({
		// 		status: false,
		// 		message: 'error while saving draft shastra data.'
		// 	})
		// });
	} else {
		res.send({
			status: false,
			message: 'All the fields are required.'
		})
	}
});

// router.get('/s/:shastra', (req, res) => {
//     res.render('format.njk');
// });

router.post('/convert', (req, res) => {
    var data = req.body.text;

    var splitData = data.split('\n');
	var divData = '';
	for (var i = 0; i < splitData.length; i++) {
		if (splitData[i]) {
			divData += `<div>${splitData[i]}</div>\n`;
		}
	}

	var divRegex = new RegExp("</div>", "g");
	var data = divData.replace(divRegex, '</div>%s%');
	var splitData = data.split('%s%');

	var ExtractJSON = [];
	for (var i = 0; i < splitData.length; i++) {
		if (splitData[i].includes('div')) {
			var dom = new JSDOM(splitData[i]);
			var el = dom.window.document.querySelector("div");
			var obj = {};
			var clsList = el.classList.value;
			console.log(clsList);
			obj.class = 'para';
			obj.text = el.innerHTML;
			ExtractJSON.push(obj);
		}
	}

    var JSONData = JSON.stringify(ExtractJSON, null, 2);

    res.send(JSONData);
    
});

module.exports = router;