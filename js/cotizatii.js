import { code_isAdmin } from "./handler.js";

$(document).ready(function() {

    function initTable(json) { // afiseaza tabelul cu cotizatii
        for (let i = 0; i < json.length; i++) {
            let row = "<tr><td>" + json[i]['cuantum'] + "</td><td>" + json[i]['data_cotizatie'] + "</td><td>" + json[i]['utilizator'] + "</td><td>" + json[i]['nume'] + " " + json[i]['adresa'] + "</td></tr>";
            $("#cotizatii").append(row);
        }
    }

    function addData() {
        let username = $("#form_username").val();
        let cotizatie = $("#form_cotizatie").val();
        let data = $("#form_data").val();
        let sala = $("#form_sala").val();
        let adresa = $("#form_adresa").val();

        $.ajax({
            url: '../php/dbHandler.php',
            method: 'POST',
            data: {
                addCotizatie: 1,
                username: username,
                cotizatie: cotizatie,
                data: data,
                sala: sala,
                adresa: adresa
            },
            complete: function(response) { // success is not working; using complete as alternative
                location.reload();
            },
            dataType: 'text',
        });
    }

    $.ajax({
        url: '../php/dbHandler.php',
        method: 'GET',
        data: {
            getCotizatii: 1,
        },
        success: function(response) { // success is not working; using complete as alternative
            // fac verificarea de admin/regular user la nivel de server si aici doar afisez un tabel
            console.log("Am primit " + JSON.parse(response));
            initTable(JSON.parse(response));
        },
        dataType: 'text'
    });

    $.ajax({
        url: '../php/dbHandler.php',
        method: 'POST',
        data: {
            checkPrivilege: 1,
        },
        complete: function(response) { // success is not working; using complete as alternative
            if (JSON.parse(response.responseText).code === code_isAdmin) {
                $("#hiddenForm").show();
                $("#form_submit").on('click', addData);
            }
        },
        dataType: 'text'
    });
});