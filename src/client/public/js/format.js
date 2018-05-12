function textAreaAdjust() {
    $('textarea').height($('textarea').scrollHeight);
}

function PostData() {
    var text = $('textarea').val();
    if (text) {
        $.post("/format/convert", {
            text: text
        }, function(data) {
            $('textarea').val(data);
            $('.floatBtn').text('Write Text').attr('onclick', "window.location.href='/format'");
            textAreaAdjust();
        });
    }
}