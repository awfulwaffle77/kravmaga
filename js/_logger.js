function logmeIn() {

    let username = document.getElementById("uname").value;
    let password = document.getElementById("passwd").value;

    let userObj = { "username":username,
                    "password":password};

    console.log(username,password);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/*window.onload = function () {
    let body = document.body,
        html = document.documentElement;

    let vid = document.getElementById("vid");
    let height = vid.offsetHeight;

    //document.getElementById("vid").style.height = height+"px";
}*/

window.onload = function() {
    let body = document.body;
    let h1 = document.getElementById("hidden1");
    let h2 = document.getElementById("hidden2");
}

document.body.onscroll = function () {
        if (document.documentElement.scrollTop >= h1.offsetTop)//Adjust Tolerance as you want
        {
            document.getElementById("divToShowHide").style.backgroundColor = "red";
        }
    }

$(function(){
    //Take your div into one js variable
    let div = $("#divToShowHide");
    //Take the current position (vertical position from top) of your div in the variable
    let pos = div.position();
    //Now when scroll event trigger do following
    $(window).scroll(function () {
        let windowpos = $(window).scrollTop();
        //Now if you scroll more than 100 pixels vertically change the class to AfterScroll
        // I am taking 100px scroll, you can take whatever you need
        if (windowpos >= (pos.top - 100)) {
            div.addClass("AfterScroll");
        }
        //If scroll is less than 100px, remove the class AfterScroll so that your content will be hidden again
        else {
            div.removeClass("AfterScroll");
        }
        //Note: If you want the content should be shown always once you scroll and do not want to hide it again when go to top agian, no need to write the else part
    });
});

/*$(function () {
    $("#login").on('click',function () {
        let username = $("#uname").val();
        let passwd = $("#passwd").val();

        if (username === ""|| passwd === "")
            console.log("Credentials are not correct");
        else {
            $.ajax(
                {
                    url: 'dbHandler.php',
                    method: 'POST',
                    data: {
                        login: 1,
                        user: username,
                        pwd: passwd
                    },
                    succes: function (response) {
                        console.log(response);
                    },
                    dataType: 'text'
                }
            );
        }
    })
});*/