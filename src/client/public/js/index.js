// popup on definition element click
function popAlert(title, content) {
    $('.modalTop').text(title);
    $('.modalText').html(content);
    $('.modalCover').show();
}

// show and hide 3 point loader
function loader(bool) {
    if (bool) {
        $('.loader').show();
    } else {
        $('.loader').hide();        
    }
}

function getQueryParams(funcName) {
    let dataObj = {};
    let querystring = window.location.search.substring(1);
    let divide = querystring.split('&');
    for (var i = 0; i < divide.length; i++) {
        let keyValPair = divide[i].split('=');
        dataObj[keyValPair[0]] = keyValPair[1];
    }
    return dataObj[funcName];
}