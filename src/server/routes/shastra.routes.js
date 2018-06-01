const express = require('express'),
    fs = require('fs'),
    router = express.Router();

const ShastraPath = 'src/server/data/shastra';

var db;
router.use((req, res, next) => {
    db = req.app.locals.db;
    next();
});

function mmpRedirect(req, res, next) {
    if (req.params.shastraID == 'mmp') {
        res.redirect(`/s/mokshmarg-prakashak/${req.params.pageID}`);
    } else {
        next();
    }
}

var LinkBrokeError = `Looks Like URL is Broken. No Shastra with such Details. Please us at our <a href="https://t.me/joinchat/GhdN1g8S4KNTRHRvqyXkBA" target="_blank">telegram group</a>.`;

router.get('/:shastraID/:pageID', mmpRedirect, (req, res) => {
    var shastraID = req.params.shastraID;
    var pageID = req.params.pageID;
    var shareID = req.query.id;
    fs.readFile(`${ShastraPath}/${shastraID}/${pageID}.json`, 'utf8', (err, shastraData) => {
		if (err) {
            res.send(LinkBrokeError);
        } else {
            var shastraJSON = JSON.parse(shastraData);
            if (shastraJSON) {
                var obj = {};
                obj.shastraID = shastraID;
                obj.pageID = pageID;
                obj.shastraJSON = shastraJSON;
                db.ref(`Shastra/${shastraID}`).once("value", (metaData) => {
                    var metaData = metaData.val();
                    obj.pageData = metaData.pages[pageID];
                    obj.metaData = metaData;
                    if (shareID) {
                        db.ref(`TextShare/${shareID}`).once("value", (data) => {
                            var data = data.val();
                            if (data) {
                                obj.yellowedText = data.text;
                                obj.shareID = shareID;
                            }
                            res.render('shastra.njk', obj);
                        });
                    } else {
                        res.render('shastra.njk', obj);
                    }
                });
            } else {
                res.send(LinkBrokeError);
            }
        }
    });
});

// store the highlighted text
router.post('/text', (req, res) => {
    var uniID = makeid();
    var YellowedText = isNotMultiPara(req.body.line);
    if (YellowedText) {
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
                message: "Your selected text must be between 20 to 1200 characters.",
                data: {
                    uniID: uniID
                }
            });
        }
    } else {
        res.send({
            status: false,
            message: "Multi paragraph selections are not allowed. Please select single paragraph between 20 to 1200 characters.",
            data: {
                uniID: uniID
            }
        });
    }
});

function isNotMultiPara(text) {
    if (text.includes('\n')) {
        if (text.endsWith('\n')) {
            return text.replace(/\n/g, '');
        } else {
            return false;
        }
    } else {
        return text;
    }
}

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 8; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

module.exports = router;