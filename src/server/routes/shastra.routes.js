const express = require('express'),
    fs = require('fs'),
    router = express.Router();

const ShastraJSON = 'src/server/data/shastra';

var db;
router.use((req, res, next) => {
    db = req.app.locals.db;
    next();
});

/* 
    read the shastra from server "data" folder
    render the JSON file
*/

router.get('/:shastraID/:pageID', (req, res) => {
    var shastraID = req.params.shastraID;
    var pageID = req.params.pageID;
    var shareID = req.query.id;

    fs.readFile(`${ShastraJSON}/${shastraID}/${pageID}.json`, 'utf8', (err, sData) => {
		if (err) {
            res.send('Looks Like URL is Broken. No Shastra with such Details.');
        } else {
            var sData = JSON.parse(sData);
            if (sData) {
                var obj = {};
                obj.shastraID = shastraID;
                obj.pageID = pageID;
                obj.sData = sData;
                if (shareID) {
                    db.ref(`TextShare/${shareID}`).once("value", (data) => {
                        var data = data.val();
                        if (data) {
                            obj.yellowedText = data.text;
                            obj.shareID = shareID;
                            res.render('shastra.njk', obj);
                        } else {
                            res.render('shastra.njk', obj);
                        }
                    });
                } else {
                    res.render('shastra.njk', obj);
                }
            } else {
                res.send('Looks Like URL is Broken. No Shastra with such Details.');
            }
        }
    });
});

// store the highlighted text
router.post('/text', (req, res) => {
    var uniID = makeid();
    var YellowedText = req.body.line;
    if (YellowedText.length > 20 && YellowedText.length < 1200) {
        var shastraID = req.body.shastraID;
        var pageID = req.body.pageID;
        db.ref(`TextShare/${uniID}`).set({
            text: YellowedText,
            shastraID: shastraID,
            pageID: pageID,
            getTime: (new Date()).getTime(),
            createdBy: 'anon'
        });
        res.send({
            status: true,
            message: 'ID created',
            data: {
                uniID: uniID
            }
        });
    } else {
        res.send({
            status: false,
            message: "Your selected text must be between 20 to 1500 characters. Multi paragraph selection also doesn't work.",
            data: {
                uniID: uniID
            }
        });
    }
});

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 8; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

module.exports = router;