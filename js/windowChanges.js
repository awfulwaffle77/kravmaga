$(document).ready(function() {

    // CORE FUNCTIONALITIES
    $(window).on('beforeunload', function () { // always scroll to top when refreshing page
        $(window).scrollTop(0);
    });

//<editor-fold> desc="Code for hidden div text"
    //Take your div into one js variable
    var div = $("#divToShowHide"); //,$("#divToShowHide2")];
    let divWrapper = $("#divWrap");
    let textHeight = div.innerHeight();
    let vidHeight = $("#vid").height();
    divWrapper.first().css('height', textHeight);
    //Take the current position (vertical position from top) of your div in the variable
    var pos = divWrapper.position();
    div.hide();

    //Now when scroll event trigger do following
    // TODO: Gotta differentiate each div in part. Get a for loop and change the point of reference to the previous div.
    $(window).scroll(function () {
        var windowpos = $(window).scrollTop();
        if (pos.top - windowpos <= (textHeight + vidHeight) / 1.5) {
            div.first().fadeIn(2000, function () {
            });
            divWrapper.css('display', 'none');
        }
    });
//</editor-fold>


});

