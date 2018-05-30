function navShare() {
    if (navigator.share != undefined) {
        var text = $('.topHead').text();
        var url = $('.linkText').text();
        navigator.share({text, url});
    }
}