import {code_isAdmin} from "./handler.js";
import {isFieldCompleted, mustCompleteField, dragElement} from "./fieldChecker.js";

$(document).ready(function () {

    const msg_eventAdd_success = "Eveniment adaugat cu succes";

    const code_eventAdd_success = 309;
    const code_eventAdd_failed = 310;

    const deleteMesage = "Vrei sa stergi acest eveniment?";

    $("#hiddenForm").hide();
    let counter = 0;

    //$("#editButton_toggle").hide();
    function showResult(response) {
        let parsedResp = JSON.parse(response.responseText);
        if (parsedResp.code === code_eventAdd_success)
            $("#eventAdd_label").text('Eveniment adaugat cu succes.');
    }

    function handleEventsInfo(jsonResponse) {
        // FACEM UN TABEL AICI
        //console.log(jsonResponse.responseText);
        let parsedResp = JSON.parse(jsonResponse.responseText);

        for (let i = 0; i < parsedResp.informatii.length; i++) {
            let id = parsedResp.informatii[i]['ID_eveniment'];
            let nume = parsedResp.informatii[i]['Nume'];
            let locatie = parsedResp.informatii[i]['Locatie'];
            let descriere = parsedResp.informatii[i]['Descriere'];
            let tip_event = parsedResp.informatii[i]['Tip_eveniment'];
            let data_start = parsedResp.informatii[i]['Data_start_eveniment'];
            let data_stop = parsedResp.informatii[i]['Data_stop_eveniment'];

            let buttonEdit = '<button id="editButton_' + id + '_edit" style="visibility: hidden; float: right; margin-top: 10px"> Edit</button>';
            let buttonDel = '<button id="delButton_' + id + '_del" style="visibility: hidden; float: right; margin-top: 10px"> Delete</button>';
            let trInsert = '<tr><td>' + nume + '</td><td>' + locatie + '</td><td>' + descriere + '</td><td>' + tip_event + '</td><td>' + data_start + '</td><td>' + data_stop + '</td><td>' + buttonEdit + '</td><td>' + buttonDel + '</td></tr>';
            $("#eventsTable tr:last").after(trInsert); // ADDS AFTER LAST TR
        }
    }


    dragElement(document.getElementById("hiddenForm"));

    $.ajax(
        {
            url: '../php/dbHandler.php',
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
            url: '../php/dbHandler.php',
            method: 'POST',
            data: {
                checkPrivilege: 1,
            },
            complete: function (response) { // success is not working; using complete as alternative
                let x = JSON.parse(response.responseText);
                if (x.code === code_isAdmin) {
                    $("button[id$='_del']").css('visibility', 'visible').on('click', function () {

                        if (confirm(deleteMesage)){
                            let id = $(this).attr('id').split("_")[1];
                            $(this).parents('tr').remove();
                            $.ajax(
                                {
                                    url: '../php/dbHandler.php',
                                    method: 'POST',
                                    data: {
                                        deleteRecord: 1,
                                        id: id
                                    },
                                    complete: function (response) { // success is not working; using complete as alternative
                                        // TODO: DO SOMETHING HERE TOO
                                        handleEventsInfo(response);
                                    },
                                    dataType: 'text'
                                }
                            );
                            }
                    });
                    $("button[id$='_edit']").css('visibility', 'visible').on('click', function () {
                        let currentTD = $(this).parents('tr').find('td');
                        if ($(this).html() === 'Edit') {
                            $.each(currentTD, function () {
                                $(this).prop('contenteditable', true)
                            });
                        } else if ($(this).html() === 'Save') {
                            let id = $(this).attr('id').split("_")[1];
                            let updatedInfo = [];
                            $.each(currentTD, function () {
                                $(this).prop('contenteditable', false);
                                updatedInfo.push($(this).html());
                            });
                            $.ajax(
                                {
                                    url: '../php/dbHandler.php',
                                    method: 'POST',
                                    data: {
                                        updateEvent: id, // MUST BE ID OF EVENT
                                        updatedInfo: updatedInfo
                                    },
                                    complete: function (response) { // success is not working; using complete as alternative
                                        // TODO: DO SOMETHING HERE
                                        handleEventsInfo(response);
                                    },
                                    dataType: 'text'
                                }
                            );
                        }

                        $(this).html($(this).html() === 'Edit' ? 'Save' : 'Edit')

                    });
                    //$("#editButton_toggle").show();
                    $("#editButton_toggle").css('visibility', 'visible').on('click', function () {
                        if (counter === 0) {
                            $("#hiddenForm").show().css('display', 'block');
                            counter = 1;
                        } else {
                            $("#hiddenForm").hide().css('display', 'none');
                            counter = 0;
                        }
                    })
                }
            },
            dataType: 'text'
        }
    );

    $("#newEvent_submit").on('click', function () {
        let nume = $("#eventAdd_nume");
        let locatie = $("#eventAdd_locatie");
        let descriere = $("#eventAdd_descriere");
        let tip_event = $("#eventAdd_tipEvent");
        let data_start = $("#eventAdd_dataStart");
        let data_stop = $("#eventAdd_dataStop");

        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();
        today = mm + '/' + dd + '/' + yyyy;

        if (isFieldCompleted(nume))
            mustCompleteField(nume);
        else
            nume = nume.val();

        if (isFieldCompleted(locatie))
            mustCompleteField(locatie);
        else
            locatie = locatie.val();
        if (isFieldCompleted(descriere))
            mustCompleteField(descriere);
        else
            descriere = descriere.val();

        if (isFieldCompleted(tip_event))
            mustCompleteField(tip_event);
        else
            tip_event = tip_event.val();

        if (data_start.val() < today)
            mustCompleteField(data_start);
        else
            data_start = data_start.val();

        if (data_stop.val() < today) {
            mustCompleteField(data_stop);
            return;
        } else
            data_stop = data_stop.val();

        $.ajax(
            {
                url: 'php/dbHandler.php',
                method: 'POST',
                data: {
                    addEvent: 1,
                    nume: nume,
                    locatie: locatie,
                    descriere: descriere,
                    tip_event: tip_event,
                    data_start: data_start,
                    data_stop: data_stop
                },
                complete: function (response) { // success is not working; using complete as alternative
                    showResult(response);
                },
                dataType: 'text'
            }
        );
    })
});