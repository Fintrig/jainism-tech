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
    if (selectedText) {
        var modifiedText = elem.replace('%selectedText%', selectedText);
        var replacedText = $('textarea').val().replace(selectedText, modifiedText);
        $('textarea').val(replacedText);
        saveLocal(replacedText);
    } else {
        alert('Please select some text to run this function.');
    }
}

function saveLocal(sContent) {
    localStorage.setItem("sContent", sContent);
}

$('.chhandText').on('click', function() {
    textEdit(`<span class="chhand">%selectedText%</span>`);
});

$('.boldText').on('click', function() {
    textEdit(`<b>%selectedText%</b>`);
});

$('.titleText').on('click', function() {
    textEdit(`<span class="titleClass">%selectedText%</span>`);
});

$('.centerText').on('click', function() {
    textEdit(`<center>%selectedText%</center>`);
});

$('.saveText').on('click', function() {
    var shastra = getQueryParams('shastra');
    var page = getQueryParams('page');
    var content = $('textarea').val();
    loader(true);
    $.post("/format/save", {
        shastra: shastra,
        page: page,
        content: content
    }, function(res) {
        saveLocal(content);
        loader(false);
        if (res.status) {
            alert('Shastra saved and updated.');
        } else {
            alert(res.message);
        }
    });
});

// get localstorage data if forget to stored previous changes
if (getQueryParams('localStorage')) {
    $('textarea').val(localStorage.getItem("sContent"));
}