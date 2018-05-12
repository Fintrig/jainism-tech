const express = require('express'),
    router = express.Router(),
    jsdom = require("jsdom"),
    { JSDOM } = jsdom;

var db;
router.use((req, res, next) => {
    db = req.app.locals.db;
    next();
});

router.get('/', (req, res) => {
    res.render('format.njk');
});

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
			// obj.element = el.tagName.toLowerCase();
			obj.class = clsList;
			obj.text = el.textContent;
			ExtractJSON.push(obj);
		}
	}

    var JSONData = JSON.stringify(ExtractJSON, null, 2);

    res.send(JSONData);
    
});

module.exports = router;