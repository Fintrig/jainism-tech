/* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
        $('.topHead').css('top', '0');
    } else {
        $('.topHead').css('top', '-50px');
    }
    prevScrollpos = currentScrollPos;
}

// increase and decrease the padding of top bar
var activateAtY = 20;
$(window).scroll(function() {
    if ($(window).scrollTop() > activateAtY) {
        $('.topHead').css('background-color','rgba(36, 48, 78, 0.9)');
    } else {
        $('.topHead').css('background-color','rgba(36, 48, 78, 1)');
    }
});

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

/*
    do something with selected text
*/

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

var TextHighlighted;
document.onmouseup = document.onkeyup = document.onselectionchange = function() {
    TextHighlighted = getSelectionText();
    if (TextHighlighted) {
        $('.SIImage').show('slow');
    } else {
        $('.SIImage').hide();
        TextHighlighted = "";
    }
};

/*
    show link on clicking the share button
*/

function ShareLink() {
    if (TextHighlighted) {
        var shastraID = $('.shastraID').text();
        var pageID = $('.pageID').text();
        var obj = {
            line: TextHighlighted,
            shastraID: shastraID,
            pageID: pageID
        }
        if (TextHighlighted.length > 20 && TextHighlighted.length < 1200) {
            $.post("/s/text", obj, function(res, status) {
                console.log(status);
                if (status) {
                    if (res.status) {
                        $('#linkToShare').val(`${document.location.origin}/s/${shastraID}/${pageID}?id=${res.data.uniID}`);
                        $('.SIImage').hide();
                        $('.shareLink').show('slow');
                    } else {
                        alert(res.message);
                    }
                } else {
                    alert('Something went wrong. Please email to hey@sowmayjain.com');
                }
            });
        } else {
            alert("Your selected text must be between 20 to 1200 characters. Multi paragraph selection also doesn't work.");
        }
    }
}

function CloseShareLink() {
    $('.shareLink').hide();
    $('#linkToShare').val(``);
}

/*
    blue highlight definition word on the whole page
*/
// $("body").children().each(function () {
//     $(this).html( $(this).html().replace(/स्वरूप/g,"<span class='paraBlue' onclick='define(this)'>स्वरूप</span>") );
// });

// popup on definition element click
function define(thisElem) {
    var text = $(thisElem).text();
    $('.modalTop').text(text);
    $('.modalCover').show();
}

// show proofread error if now proofread
var proofbool = $('.proofread').text();
if (proofbool == "false") {
    $('.proofError').show();
} 