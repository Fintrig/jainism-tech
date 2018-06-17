/* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
        $('.topHead').css('top', '0');
    } else {
        $('.topHead').css('top', '-100px');
    }
    prevScrollpos = currentScrollPos;
}

/*
    get highlight query parameter from URL
    search for text and highlight it yellow
    scroll to that space element on the page
*/
var TextToBeYellowed = $('.sharedText').text();
if (TextToBeYellowed) {
    var sid = getQueryParams('id');
    textSearch();
}

function textSearch() {
    var eachBool = true;
    $(".shastraCover").children().each(function() {
        if ($(this).html().includes(TextToBeYellowed) && eachBool) {
            eachBool = false;
            console.log(sid);
            $(this).html($(this).html().replace(TextToBeYellowed, `<span class='paraYello'><a shareID='${sid}'>${TextToBeYellowed}</a></span>`));
            yellowScroll(sid);
            return false;
        }
    });
}

function yellowScroll(sid) {
    var target = $(`[shareID=${sid}]`);
    $('html, body').animate({
        scrollTop: target.offset().top - 150
    }, 1000, function() {
        var $target = $(target);
        $target.focus();
        if ($target.is(":focus")) {
            return false;
        } else {
            $target.attr('tabindex','-1');
            $target.focus();
        };
    });
}

// do something with selected text
function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        var text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        var text = document.selection.createRange().text;
    }
    return text;
}

// show link on clicking the share button
function shareLink() {
    var TextHighlighted = getSelectionText();
    if (TextHighlighted) {
        var scriptureCode = $('.scriptureCode').text();
        var pageID = $('.pageID').text();
        var obj = {
            line: TextHighlighted,
            scriptureCode: scriptureCode,
            pageID: pageID
        }
        if (TextHighlighted.length > 20 && TextHighlighted.length < 1200) {
            loader(true);
            $.post("/s/textShare", obj, function(res, status) {
                if (status) {
                    if (res.status) {
                        var scriptureSlug = $('.scriptureSlug').text();
                        var fullURL = `${document.location.origin}/s/${scriptureSlug}/${pageID}?id=${res.data.uniID}`;
                        console.log(fullURL);
                        $('.linkText').html(`<p><a href="${fullURL}">${fullURL}</a></p>`);
                        if (navigator.share != undefined) {
                            $('.shareModalBtn').show();
                        }
                        $('.copyModel').show();
                    } else {
                        popAlert('ERROR', res.message);
                    }
                } else {
                    popAlert('ERROR', 'Something went wrong. Please email to hey@sowmayjain.com');
                }
                loader(false);
            });
        } else {
            popAlert('ERROR', "Your selected text must be between 20 to 1200 characters. Multi paragraph selection also doesn't work.");
        }
    }  else {
        popAlert('Function Error', "You can't run share function without selecting or highlighting text on this page.");        
    }
}

// share link on android chrome +61 version
function navShare() {
    if (navigator.share != undefined) {
        var text = $('.topHead').text();
        var url = $('.linkText').text();
        navigator.share({text, url});
    }
}

// copy link from modal
function copyLinkToClip() {
    var fullURL = $('.linkText').text();
    var inputElem = $('<input>').val(fullURL);
    $('body').append(inputElem);
    inputElem.select();
    try {
        var ok = document.execCommand('copy');
        if (ok) {
            // popAlert(`URL Copied!`, `The selected text specific unique link has been copied to your clipboard.`);
        } else {
            popAlert(`Unable to copy the URL`, `Due to some error, we are not able to copy the text on your clipboard. Please copy the following link or click to redirect:<p><a href="${fullURL}">${fullURL}</a></p>`);
        }
    } catch (err) {
        popAlert(`Unsupported Browser`, `Due to browser compatibility issue, we are not able to copy the text on your clipboard. Please copy the following link or click to redirect:<p><a href="${fullURL}">${fullURL}</a></p>`);
    }
    inputElem.remove();
    $('.copyModel').hide();
}

// show proofread error if now proofread
var proofbool = $('.proofread').text();
if (proofbool == "false") {
    popAlert(`WARNING`, `This page has not been proofread. Read at your own risk.`);
}