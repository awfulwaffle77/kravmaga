import {code_isAdmin} from "./handler.js";
$(document).ready(function () {

$("#hiddenForm").hide();
    function handleEventsInfo(jsonResponse){
        // FACEM UN TABEL AICI
        console.log(jsonResponse.responseText);
        let parsedResp = JSON.parse(jsonResponse.responseText);

        for(let i = 0;i < parsedResp.informatii.length; i++) {
            let id = parsedResp.informatii[i]['ID_eveniment'];
            let nume = parsedResp.informatii[i]['Nume'];
            let locatie = parsedResp.informatii[i]['Locatie'];
            let descriere = parsedResp.informatii[i]['Descriere'];
            let tip_event = parsedResp.informatii[i]['Tip_eveniment'];
            let data_start = parsedResp.informatii[i]['Data_start_eveniment'];
            let data_stop = parsedResp.informatii[i]['Data_stop_eveniment'];

            let trInsert = '<tr><td>' + nume + '</td><td>' + locatie + '</td><td>'+ descriere + '</td><td>' + tip_event + '</td><td>' + data_start + '</td><td>' + data_stop + '</td></tr>';
            $("#eventsTable tr:last").after(trInsert); // ADDS AFTER LAST TR
        }
    }

    $.ajax(
        {
            url: 'php/dbHandler.php',
            method: 'GET',
            data: {
                getEventsInfo: 1,
            },
            complete: function (response) { // success is not working; using complete as alternative
                    handleEventsInfo(response);
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
                    $("#editButton_toggle").on('click',function () {
                        if($("#hiddenForm").is(":visible"))
                            $("#hiddenForm").show();
                        else
                            $("#hiddenForm").hide();
                    })
                }
            },
            dataType: 'text'
        }
    );
});