// IMPORT SOME FIELD CHECK FUNCTIONS FROM HERE. GOOD PRACTICE OR NOT?

export function signupBoxInfoAdd(jsonResponse) { // ADD ID_SALA AND ID_CENTURA
    try {
        let parsed = JSON.parse(jsonResponse);

        for (let i = 0; i < parsed['sali'].length; i++) {
            let opt = new Option(parsed.sali[i].NUME + ', ' + parsed.sali[i].ADRESA, i);
            $(opt).html(parsed.sali[i].NUME + ', ' + parsed.sali[i].ADRESA);
            $("#signup_sala").append(opt);
        }
        for (let i = 0; i < parsed.centuri.length; i++) {
            let opt = new Option(parsed.centuri[i].CULOARE, i);
            $(opt).html(parsed.centuri[i].CULOARE);
            $("#signup_centura").append(opt);
        }
    }
    catch(e){
        console.log(e + "There was an error fetching info from the server");
    }
}

export function profileBoxInfoAdd(jsonResponse) {
    let parsedResp = JSON.parse(jsonResponse);
    $("#profile_nume").text(parsedResp.informatii['nume']);
    $("#profile_prenume").text(parsedResp.informatii['prenume']);
    $("#profile_username").text(parsedResp.informatii['utilizator']);
    $("#profile_passwd").text("Resetare parola").attr('href','passwordReset.html');
}

export function checkEmailPattern(email){
    let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(email);
}

export function handleUserUnavailable(){
    $("#signup_username_err").text("Username deja existent");
}

export function handleUserAvailable() {
    $("#signup_username_err").text("");
}

export function isFieldCompleted(fieldName){
    let x = $(fieldName).val();
   if($(fieldName).val() === "")
       return false;
   return true;
}

export function setFieldsToDefault() {
    $("[id$='_err']").val(""); // ALL FIELDS ENDING IN "_err" WILL RESET
}

export function mustCompleteField(fieldName) { // APPEND "_err" AND SHOW THE ERROR MESSAGE
    console.log("New field who dis" + fieldName);
    // TODO: THIS FUNCTION
    let errLabel = fieldName + "_err";
    $(errLabel).text("Acest camp trebuie completat");
}

export function handlePasswordsNotMatch(){
    $("#signup_passwdCheck_err").text("Parolele nu coincid");
}

export function handlePasswordsMatch() {
    $("#signup_passwdCheck_err").text("");
}


