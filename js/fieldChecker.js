$(document).ready(function () {

    const usernameAvailable = 300;
    const usernameUnavailable = 301;

    $("#signup_username").change(function () {
        let username = $("#signup_username").val();

        $.ajax({
            url: 'php/dbHandler.php',
            method: 'POST',
            cahce:false,
            data: {
                checkUsernameAvailable: 1,
                username: username
            },
            complete: function (response) { // success is not working; using complete as alternative
                // TELL ME ABOUT THAT USERNAME. IS IT AVAILABLE?
                parsedResponse = JSON.parse(response.responseText);
                if(parsedResponse.code === usernameUnavailable)
                    $("#signup_errMsg").text("Username deja existent");
                else
                    $("#signup_errMsg").text("");
                // TODO: Daca signup_errMsg a fost setat, pune-l gol. Nu merge asta.
            },
            dataType: 'text'
        });
    })
});
