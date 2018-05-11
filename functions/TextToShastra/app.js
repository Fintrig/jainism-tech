const fs = require('fs');

fs.readFile('./mmp.html', 'utf8', (err, data) => {
    if (err) {
        throw err;
	}

	var splitData = data.split('\r\n');
	// console.log(splitData);
	var divData = '<div>\r\n';
	for (var i = 0; i < splitData.length; i++) {
		if (splitData[i]) {
			divData += `<p>${splitData[i]}</p>\r\n`;
		}
	}
	divData += '</div>';

	fs.writeFile("./InputShastra.html", divData, (err) => {
		if (err) {
			return console.log(err);
		}
		console.log("Wrote the file");
	});

});