const express = require('express'),
    fs = require('fs'),
    router = express.Router();

var db;
router.use((req, res, next) => {
    db = req.app.locals.db;
    next();
});

function mmpRedirect(req, res, next) {
    if (req.params.shastraID == 'mmp') {
        var url = `/s/mokshmarg-prakashak/${req.params.pageID}`;
        if (req.query.id) {
            url += `?id=${req.query.id}`;
        }
        res.redirect(url);
    } else {
        next();
    }
}

router.get('/:scriptureSlug/:pageID', mmpRedirect, (req, res) => {
    var scriptureSlug = req.params.scriptureSlug;
    var pageID = req.params.pageID;
    var shareID = req.query.id;
    db.collection('scripture').where('slug', '==', scriptureSlug).limit(1).get().then(snapshot => {
        if (snapshot.empty) {
            res.send({
                status: false,
                message: "Invalid URL."
            });
        } else {
            snapshot.forEach((doc) => {
                var metadata = doc.data();
                var scriptureCode = metadata.code;
                db.collection('scripture').doc(scriptureCode).collection('final').doc(pageID).get().then(pageDoc => {
                    if (pageDoc.exists) {
                        var contentArr = pageDoc.data().content.split('\n');
                        var obj = {
                            scriptureSlug: scriptureSlug,
                            pageID: pageID,
                            contentArr: contentArr,
                            author: metadata.author,
                            name: metadata.name,
                            chapterTitle: pageDoc.data().title,
                            proofread: metadata.proofread,
                        };
                        if (shareID) {
                            db.collection('textShare').doc(shareID).get().then(tsDoc => {
                                var tsDoc = tsDoc.data();;
                                if (tsDoc) {
                                    obj.yellowedText = tsDoc.text;
                                }
                                res.render('scripture.njk', obj);
                            });
                        } else {
                            res.render('scripture.njk', obj);
                        }
                    } else {
                        res.send({
                            status: false,
                            message: "Invalid URL."
                        });
                    }
                }).catch(err => {
                    console.log(`[ERROR] (scripture.routes.js) (8258) (${scriptureSlug}) - (${pageID}) - ${err}`);
                    res.send({
                        status: false,
                        message: 'error while fetching data from finalshastra.'
                    });
                });
            });
        }
    }).catch((err) => {
        console.log(`[ERROR] (scripture.routes.js) (6258) (${scriptureSlug}) - (${pageID}) - ${err}`);
        res.send({
            status: false,
            message: "Unexpected error occured on server. Please try again."
        });
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