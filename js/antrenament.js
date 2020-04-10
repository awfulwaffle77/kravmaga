import {getUrlParameter} from './handler.js'

$(document).ready(function () {

    let idtkn = getUrlParameter('id');

    function handleInfo(response) {
        let parsedResp = JSON.parse(jsonResponse.responseText);

        for (let i = 0; i < parsedResp.informatii.length; i++) {
            let nume = parsedResp.informatii[i]["Nume"];
            let prenume = parsedResp.informatii[i]["Prenume"];
            // TODO: SHOW USERS TABLE
        }
    }

    $.ajax(
        {
            url: '../php/dbHandler.php',
            method: 'GET',
            data: {
                getAntrenament: 1,
                id: idtkn
            },
            complete: function (response) { // success is not working; using complete as alternative
                handleInfo(response);
            },
            dataType: 'text'
        }
    );
});