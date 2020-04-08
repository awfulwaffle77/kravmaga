import {code_isAdmin} from "./handler.js";

$(document).ready(function () {

    let counter = 0;

    function handleInfo(jsonResponse){
        console.log(jsonResponse.responseText);
        let parsedResp = JSON.parse(jsonResponse.responseText);

        for(let i = 0;i < parsedResp.informatii.length; i++) {
            let id = parsedResp.informatii[i]['ID_Antrenament'];
            let nume = parsedResp.informatii[i]['Nume'];
            let adresa = parsedResp.informatii[i]['Adresa'];
            let instructori = parsedResp.informatii[i]['Instructori'];
            let data = parsedResp.informatii[i]['Data'];

            let trInsert = '<tr><td>' + nume + '</td><td>' + adresa + '</td><td>'+ instructori + '</td><td>' + data + '</td></tr>';
            $("#antrnmntTable tr:last").after(trInsert); // ADDS AFTER LAST TR
        }
    }

    $.ajax(
        {
            url: 'php/dbHandler.php',
            method: 'GET',
            data: {
                getAntrenamenteInfo: 1,
            },
            complete: function (response) { // success is not working; using complete as alternative
                handleInfo(response);
            },
            dataType: 'text'
        }
    );

    $.ajax(
        {
            url: 'php/dbHandler.php',
            method: 'POST',
            data: {
                checkPrivilege: 1,
            },
            complete: function (response) { // success is not working; using complete as alternative
                let x = JSON.parse(response.responseText);
                if(x.code === code_isAdmin){
                    //$("#editButton_toggle").show();
                    $("#editButton_toggle").css('visibility','visible').on('click',function () {
                        if(counter === 0){
                            $("#hiddenForm").show().css('display','block');
                            counter = 1;
                        }
                        else{
                            $("#hiddenForm").hide().css('display','none');
                            counter = 0;
                        }
                    })
                }
            },
            dataType: 'text'
        }
    );

});