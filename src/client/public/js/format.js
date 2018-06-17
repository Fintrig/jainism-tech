function getText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

function textEdit(elem) {
    var selectedText = getText();
    var scripture = getQueryParams('scripture');
    var page = getQueryParams('page');
    if (scripture && page) {
        if (selectedText) {
            var modifiedText = elem.replace('%selectedText%', selectedText);
            var replacedText = $('textarea').val().replace(selectedText, modifiedText);
            $('textarea').val(replacedText);
            saveLocal(replacedText);
        } else {
            popAlert('ERROR', 'Please select some text to run this function.');
        }
    } else {
        popAlert('ERROR', 'Please define the scripture code and page in query params.');
    }
}

function saveLocal(sContent) {
    localStorage.setItem("sContent", sContent);
}

$('.verseText').on('click', function() {
    textEdit(`<div class="verse">%selectedText%</div>`);
});

$('.boldText').on('click', function() {
    textEdit(`<b>%selectedText%</b>`);
});

$('.titleText').on('click', function() {
    textEdit(`<div class="paraHead">%selectedText%</div>`);
});

$('.centerText').on('click', function() {
    textEdit(`<center>%selectedText%</center>`);
});

$('.saveText').on('click', function() {
    var scripture = getQueryParams('scripture');
    var page = getQueryParams('page');
    var content = $('textarea').val();
    loader(true);
    $.post("/format/save", {
        scripture: scripture,
        page: page,
        content: content
    }, function(res) {
        saveLocal(content);
        loader(false);
        if (res.status) {
            popAlert('SUCCESS', 'Scripture Updated');
        } else {
            popAlert('ERROR', res.message);
        }
    });
});

// get localstorage data if forget to stored previous changes
if (getQueryParams('localStorage')) {
    $('textarea').val(localStorage.getItem("sContent"));
}