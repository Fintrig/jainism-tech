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