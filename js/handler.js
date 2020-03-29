$(document).ready(function(){
    // DECLARING VARIABLES
    const loginRedirectURL = "https://localhost/kravmaga_v2/";
    const adminProfileRedirect = "https://localhost/kravmaga_v2/signup.html";
    const regularProfileRedirect = "htpps://localhost/kravmaga_v2/profile.html"; // Better option would be to use default anchor option
    // TODO: Check if it possible to use default anchor

    // DECLARING LOGIN CODES (class JSON_Response from dbHandler.php has message and code)
    const code_correctCredentials = 1;
    const code_incorrectCredentials = 2;
    const code_isAdmin = 100;
    const code_isRegularUser = 101;

    // FUNCTIONS
    function interpretResponse(response) {
        switch (response.code) {
            case code_correctCredentials:
                window.location.replace(loginRedirectURL);
                break;
            case code_incorrectCredentials:
                $("#errMsg").text("Username sau parola gresite.");
                break;
            case code_isAdmin:
                window.location.replace(adminProfileRedirect);
                break;
            case code_isRegularUser:
                window.location.replace(regularProfileRedirect);
        }

    }

    // MAIN CODE
    // PROFILE ANCHOR HANDLING
    if (Cookies.get('logged') === '1') { // If the cookie shows that the user is logged, the Login button is updated
        // Changing the name and href accordingly
        $("#loginProfile").text('Profil').attr('href', 'profile.html').on('click',function (e) {
            e.preventDefault();
            // Checking where to redirect
            $.ajax(
                {
                    url: 'php/dbHandler.php',
                    method: 'POST',
                    data: {
                        checkUsername: 1,
                    },
                    complete: function (response) { // success is not working; using complete as alternative
                        //console.log(response.responseText);
                        interpretResponse(JSON.parse(response.responseText));
                    },
                    dataType: 'text'
                });
            e.preventDefault();
        });

    }
    // SIGNUP USERNAME ALREADY IN USE CHECK
    // TODO: CHECK IF USERNAME EXISTS
    // SIGNUP CONFIRM BUTTON CLICK
    $("#signupConfirm").on('click',function (e) {
        e.preventDefault();
        let nume=$("#signup_nume");
        let prenume= $("#signup_prenume");
        let username = $("#signup_username");
        let passwd = $("#signup_passwd");
        let data = $("#signup_data");
        $.ajax(
            {
                url: 'php/dbHandler.php',
                method: 'POST',
                data: {
                    signup: 1,
                    nume: nume,
                    prenume: prenume,
                    username: username,
                    passwd: passwd,
                    date: data
                },
                complete: function (response) { // success is not working; using complete as alternative
                    //console.log(response.responseText);
                    interpretResponse(JSON.parse(response.responseText));
                },
                dataType: 'text'
            })
    });
    // LOGIN SUBMIT BUTTON CLICK
    $("#loginSubmit").on('click',function (e) {
        e.preventDefault();
        let username = $("#uname").val();
        let passwd = $("#passwd").val();

        if (username === ""|| passwd === "")
            console.log("Credentials are not correct");
        else {
            $.ajax(
                {
                    url: 'php/dbHandler.php',
                    method: 'POST',
                    data: {
                        login: 1,
                        uname: username,
                        passwd: passwd
                    },
                    complete: function (response) { // success is not working; using complete as alternative
                        //console.log(response.responseText);
                        interpretResponse(JSON.parse(response.responseText));
                    },
                    dataType: 'text'
                }
            );
        }
    })
});

