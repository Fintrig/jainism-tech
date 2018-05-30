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
var TextToBeYellowed = $('.SharedText').text();
if (TextToBeYellowed) {
    var sid = $('.SharedText').attr('id');
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
var TextHighlighted;
// it's to check if there's no text return (TextHighlighted is returned)
// so to not run copy and share function even if the text is not highlighted for more than 3 seconds
var textHighBool = true;
function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        var text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        var text = document.selection.createRange().text;
    }
    if (text) {
        textHighBool = true;
        return text;
    } else {
        if (textHighBool) {
            setTimeout(function(){TextHighlighted="";}, 3000);
        }
        textHighBool = false;
        return TextHighlighted;
    }
}

// show bottom icon if selected text
document.onmouseup = document.onkeyup = document.onselectionchange = function() {
    TextHighlighted = getSelectionText();
    if (TextHighlighted) {
        $('.iconSect').show();
    }
};

// show link on clicking the share button
function shareLink() {
    if (TextHighlighted) {
        var shastraID = $('.shastraID').text();
        var pageID = $('.pageID').text();
        var obj = {
            line: TextHighlighted,
            shastraID: shastraID,
            pageID: pageID
        }
        if (TextHighlighted.length > 20 && TextHighlighted.length < 1200) {
            loader(true);
            $.post("/s/text", obj, function(res, status) {
                if (status) {
                    if (res.status) {
                        var fullURL = `${document.location.origin}/s/${shastraID}/${pageID}?id=${res.data.uniID}`;
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

// copy selected text
// function copyText() {
//     if (TextHighlighted) {
//         var inputElem = $('<input>').val(TextHighlighted);
//         $('body').append(inputElem);
//         inputElem.select();
//         try {
//             var ok = document.execCommand('copy');
//             if (ok) {
//                 popAlert('Text Copied!', 'The selected text on the page has been copied to your clipboard.');
//             } else {
//                 popAlert('Unable to copy the text', 'Due to some error, we are not able to copy the text on your clipboard. Please copy the text directly from webpage.');
//             }
//         } catch (err) {
//             popAlert('Unsupported Browser', 'Due to browser compatibility issue, we are not able to copy the text on your clipboard. Please copy the text directly from webpage.');
//         }
//         inputElem.remove();
//     } else {
//         popAlert('Function Error', "You can't run share or copy functions without selecting or highlighting text on this page.");        
//     }
// }

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

/*
    blue highlight definition word on the whole page
*/
// $("body").children().each(function () {
//     $(this).html( $(this).html().replace(/स्वरूप/g,"<span class='paraBlue' onclick='define(this)'>स्वरूप</span>") );
// });

// show proofread error if now proofread
var proofbool = $('.proofread').text();
if (proofbool == "false") {
    popAlert(`WARNING`, `This page has not been proofread. Read at your own risk.`);
}