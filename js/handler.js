import {handleUserAvailable, handleUserUnavailable, signupBoxInfoAdd, mustCompleteField, isFieldCompleted, handlePasswordsNotMatch,
setFieldsToDefault, handlePasswordsMatch, profileBoxInfoAdd, checkEmailPattern } from "./fieldChecker.js";

export const code_isAdmin = 100;

export let getUrlParameter = function getUrlParameter(sParam) {
    let sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};
$(document).ready(function(){



    // DECLARING VARIABLES
    const loginRedirectURL = "https://localhost/kravmaga_v2/pages/profile.html";
    const adminProfileRedirect = "https://localhost/kravmaga_v2/pages/signup.html";
    const regularProfileRedirect = "https://localhost/kravmaga_v2/pages/profile.html"; // Better option would be to use default anchor option (in php?)
    const signupSuccessRedirect = "https://localhost/kravmaga_v2/pages/success.html";
    const successRedirect = "https://localhost/kravmaga_v2/pages/success.html";
    // TODO: Check if it possible to use default anchor. It is. Change this to getting the page with php

    // DECLARING LOGIN CODES (class JSON_Response from dbHandler.php has message and code)
    const code_correctCredentials = 1;
    const code_incorrectCredentials = 2;
    const code_isRegularUser = 101;
    const code_userInsert_good = 200;

    const usernameAvailable = 300;
    const usernameUnavailable = 301;

    // FUNCTIONS
    function interpretResponse(response) {
        try {
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
                    break;
                case code_userInsert_good:
                    window.location.replace(adminProfileRedirect);
                    break;
                default:
                    break;
            }
        }
        catch (e) {
           console.log(e.message());
        }
    }

    function eventFire(el, etype){
        if (el.fireEvent) {
            el.fireEvent('on' + etype);
        } else {
            let evObj = document.createEvent('Events');
            evObj.initEvent(etype, true, false);
            el.dispatchEvent(evObj);
        }
    }
    // MAIN CODE
    // HANDLE ENTER PRESS
    $(document).on('keypress', function (e) {
        // ON ENTER PRESS, DEPENDING ON PAGE, SUBMIT FORM
        if($("#signupConfirm").length) // IF ELEMENT EXISTS
        {
            if(e.which == 13) // IF ENTER IS PRESSED
                $("#signupConfirm").click(); // CLICK THE CONFIRM BUTTON
        }
    });
    // PROFILE ANCHOR HANDLING
    if (Cookies.get('logged') === '1') { // If the cookie shows that the user is logged, the Login button is updated
        // Changing the name and href accordingly
        $("#loginProfile").text('Profil').attr('href', 'profile.html').on('click',function (e) {
            // Checking where to redirect
            $.ajax(
                {
                    url: '../php/dbHandler.php',
                    method: 'POST',
                    data: {
                        checkPrivilege: 1,
                    },
                    complete: function (response) { // success is not working; using complete as alternative
                        //console.log(response.responseText);
                        interpretResponse(JSON.parse(response.responseText));
                    },
                    dataType: 'text'
                });
        });
    }
    // SIGNUP CONFIRM BUTTON CLICK
    $("#signupConfirm").on('click',function (e) {
        e.preventDefault();
        // CHECKING FIELDS TO BE COMPLTED
        let nume, username, email, passwd, id_centura, id_sala;
        setFieldsToDefault();

        if(!isFieldCompleted("#signup_nume")) {
            mustCompleteField("#signup_nume");
            return;
        }
        else
            nume = $("#signup_nume").val();

        let prenume= $("#signup_prenume").val();

        if(!isFieldCompleted("#signup_username")) {
            mustCompleteField("#signup_username");
            return;
        }
        else
           username = $("#signup_username").val();

        if(!isFieldCompleted("#signup_email")){
            mustCompleteField("#signup_email");
            return;
        }
        else
            email = $("#signup_email").val();

        if(!isFieldCompleted("#signup_passwd")) {
            mustCompleteField("#signup_passwd");
            return;
        }
        else
            passwd = $("#signup_passwd").val();

        let data = $("#signup_data").val();

        if($("#signup_sala").val === "-- Alegeti o sala --") {
            mustCompleteField("#signup_sala");
            return;
        }
        else
            id_sala = $("#signup_sala option:selected").text();

        if($("#signup_centura").val() === "-- Alegeti o centura --") {
            mustCompleteField("#signup_centura");
            return;
        }
        else
            id_centura = $("#signup_centura option:selected").text();


        $.ajax(
            {
                url: '../php/dbHandler.php',
                method: 'POST',
                data: {
                    signup: 1,
                    nume: nume,
                    prenume: prenume,
                    username: username,
                    email: email,
                    passwd: passwd,
                    date: data,
                    id_sala: id_sala.toString(),
                    id_centura: id_centura.toString(),
                    currentHash: Cookies.get("currentHash")
                },
                complete: function (response) { // success is not working; using complete as alternative
                    //console.log(response.responseText);
                    try {
                        interpretResponse(JSON.parse(response.responseText));
                    }
                    catch(e) {
                        console.log(response.responseText);
                    }
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
                    url: '../php/dbHandler.php',
                    method: 'POST',
                    data: {
                        login: 1,
                        uname: username,
                        passwd: passwd
                    },
                    complete: function (response) { // success is not working; using complete as alternative
                        //console.log(response.responseText);
                        try {
                            interpretResponse(JSON.parse(response.responseText));
                        }
                        catch(e){
                            console.log(response.responseText);
                        }
                    },
                    dataType: 'text'
                }
            );
        }
    });
    // SIGNUP
    if($("#signupBox").length){ // If element exists on page; If I am on signup.html
        // DO SQL FETCH OF ID_SALA AND ID_CENTURA
        $.ajax({
            url: '../php/dbHandler.php',
            method: 'GET',
            data:{
                getSignupInfo: 1
            },
            complete: function (response) {
                signupBoxInfoAdd(response.responseText);
            }
        });

        // SET MAX SIGNUP DATE TO TODAY
        let dateToday = new Date();

        let year = dateToday.getFullYear();
        let month = dateToday.getMonth() + 1;
        let day = dateToday.getDate();

        if(month < 10)
            month = '0' + month.toString();
        if(day < 10)
            day = '0' + day.toString();

        let minDate= year + '-' + month + '-' + day;

        $("#signup_data").attr('max',minDate).val(minDate);
    }
    // CHECK IF USERNAME IS AVAILABLE
    $("#signup_username").change(function () { // CHECK IF CURRENT USERNAME IS AVAILABLE
        let username = $("#signup_username").val();

        $.ajax({
            url: '../php/dbHandler.php',
            method: 'POST',
            cahce:false,
            data: {
                checkUsernameAvailable: 1,
                username: username
            },
            complete: function (response) { // success is not working; using complete as alternative
                // TELL ME ABOUT THAT USERNAME. IS IT AVAILABLE?
                let parsedResponse = JSON.parse(response.responseText);
                if(parsedResponse.code === usernameUnavailable)
                    handleUserUnavailable();
                else if(parsedResponse.code === usernameAvailable)
                    handleUserAvailable();
                else{
                    console.log(response.responseText);
                }
            },
            dataType: 'text'
        });
    });
    // CHECK IF PASSWORD HAS AT LEAST 4 CHARACTERS
    $("#signup_passwd").change(function () {
       let pattern = /[0-9a-bA-b]{4}/i;
        let x = $(this).val();
        if(!pattern.test($(this).val()))
            $("#signup_passwd_err").text("Parola trebuie sa continta cel putin 4 caractere");
        else
            $("#signup_passwd_err").text("");
    });
    // CHECK IF PASSWORDS MATCH
    $("#signup_passwdCheck").change(function () {
        if($("#signup_passwd").val() !== $("#signup_passwdCheck").val())
            handlePasswordsNotMatch();
        else
            handlePasswordsMatch();
    });
    // PROFILE
    if($("#profileBox").length){ // IF I AM ON PROFILE PAGE
        // FETCH THE DATA REQUIRED TO SHOW
        let pressed = 0;
        $.ajax({
            url: '../php/dbHandler.php',
            method: 'GET',
            data:{
                getProfileInfo: 1,
                currentHash: Cookies.get('currentHash')
            },
            complete: function (response) {
                profileBoxInfoAdd(response.responseText);
            }
        });

        $("#edit_profile").on('click',function () {
            if(pressed === 0){
                $("#profile_nume").attr('readonly',false);
                $("#profile_prenume").attr('readonly',false);
               pressed = 1;
            }
            else if(pressed === 1){
                $("#profile_nume").attr('readonly',true);
                $("#profile_prenume").attr('readonly',true);
                pressed = 0;
            }
        });
    }
    // EMAIL RESET
    if($("#emailBox").length){
        $("#emailReset_confirm").on('click',function () {
            let email = $("#email").val();
            if(!checkEmailPattern(email)) { // IF WE TRY TO SUBMIT A BAD EMAIL
                $("#reset_email_err").text("Nu este o adresa de email valida");
                return;
            }
            $.ajax({
                url: '../php/mailAgent.php',
                method: 'POST',
                data:{
                    sendResetPasswordEmail: 1,
                    email: email
                },
                complete: function (response) {
                    $("#emailDone").text("Un email cu instructiuni a fost trimis la adresa " + email);
                    window.location.replace()
                }
            });
        });
        $("#email").on('change',function () {
            if(!checkEmailPattern($("#email").val())){
                $("#reset_email_err").text("Nu este o adresa de email valida");
            }
            else{
                $("#reset_email_err").text("");
            }

        })

    }
    // NEW PASSWORD IN EMAIL URL
    if($("#newPasswdBox").length){
        $("#newPasswdConfirm").on('click',function () {
            let newPasswd = $("#newPasswd").val();
            let token = getUrlParameter('tkn');

            $.ajax({
                url: '../php/mailAgent.php',
                method: 'POST',
                data:{
                    sendPasswordReset: 1,
                    newPasswd: newPasswd,
                    tkn: token
                },
                complete: function (response) {
                    console.log(response.responseText);
                }
            });
        })
    }
});

