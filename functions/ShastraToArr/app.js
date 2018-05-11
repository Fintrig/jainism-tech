const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

fs.readFile('./input.html', 'utf8', (err, data) => {
    if (err) {
        throw err;
	}

	var divRegex = new RegExp("</div>", "g");
	var data = data.replace(divRegex, '</div>%s%');
	var splitData = data.split('%s%');

	var ExtractJSON = [];
	for (var i = 0; i < splitData.length; i++) {
		if (splitData[i].includes('div')) {
			var dom = new JSDOM(splitData[i]);
			var el = dom.window.document.querySelector("div");
			var obj = {};
			var clsList = el.classList.value;
			obj.element = el.tagName.toLowerCase();
			obj.class = clsList;
			obj.text = el.textContent;
			ExtractJSON.push(obj);
		}
	}

	var WriteData = JSON.stringify(ExtractJSON, null, 2);
	fs.writeFile("./output.json", WriteData, (err) => {
		if (err) {
			return console.log(err);
		}
		console.log("Wrote the file");
	});

});