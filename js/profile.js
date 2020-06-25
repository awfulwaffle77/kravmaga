import { code_isAdmin } from "./handler.js";

$(document).ready(function() {
    $("#signup_redirect").hide();
    $.ajax({
        url: '../php/dbHandler.php',
        method: 'POST',
        data: {
            checkPrivilege: 1,
        },
        complete: function(response) { // success is not working; using complete as alternative
            if (JSON.parse(response.responseText).code === code_isAdmin) {
                $("#signup_redirect").show();
            }
        },
        dataType: 'text'
    });
});

const change_appearance = () => {
    var modify = document.getElementById("edit_profile");

    var name = document.getElementById("profile_nume");
    var prenume = document.getElementById("profile_prenume");
    let pressed = 1;
    modify.addEventListener('click', () => {

        if (pressed === 1) {

            name.style.backgroundColor = "whitesmoke";
            name.style.color = "black";
            name.style.borderStyle = "none";
            name.style.borderRadius = "2px";

            prenume.style.backgroundColor = "whitesmoke";
            prenume.style.color = "black";
            prenume.style.borderStyle = "none";
            prenume.style.borderRadius = "2px";
            pressed = 0;
        } else if (pressed === 0) {
            name.style.backgroundColor = "transparent";
            name.style.color = "whitesmoke";
            name.style.borderStyle = "ridge";
            name.style.borderColor = "tomato";
            name.style.borderRadius = "0px";

            prenume.style.backgroundColor = "transparent";
            prenume.style.color = "whitesmoke";
            prenume.style.borderStyle = "ridge";
            prenume.style.borderColor = "tomato";
            prenume.style.borderRadius = "0";
            pressed = 1;
        }


    });
};


change_appearance();