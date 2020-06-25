import {getUrlParameter} from './handler.js'
import {dragElement} from "./fieldChecker.js";
import {code_isAdmin} from "./handler.js";
import {mustCompleteField} from "./fieldChecker.js";

$(document).ready(function () {

    let counter = 0;
    let idtkn = getUrlParameter('id');
    const deleteMessage = "Vrei sa stergi acest eveniment?";

    function handleInfo(jsonResponse) {
        console.log(jsonResponse.responseText);
        let parsedResp = JSON.parse(jsonResponse.responseText);
        if (parsedResp.code === 314) {
            console.log("Error code 314, cannot fetch data.");
            return;
        }

        $("#eventsTable tr").find("tr:gt(0)").remove();
        if (parsedResp.informatii.length > 0)
            for (let i = 0; i < parsedResp.informatii.length; i++) {
                let id = parsedResp.informatii[i]["id_utilizator_antrenament"];
                let nume = parsedResp.informatii[i]["Nume"];
                let prenume = parsedResp.informatii[i]["Prenume"];

                //let buttonDel = '<button type="button" id="delButton_' + id + '_del">Delete</button>';
                let checkBox = '<input type="checkbox" id="checkBox_' + id + '"/>';
                let trInsert = '<tr><td style="display: none;">' + checkBox + ' </td><td>' + nume + '</td><td>' + prenume + '</td>' +/* buttonDel +*/ '</tr>';
                $("#eventsTable tr:last").after(trInsert); // ADDS AFTER LAST TR
                // HIDE DEL BUTTONS
              //  $("button[id$='_del']").hide();
                // HIDE CHECKBOXES
                //$("input[id^='checkBox_']").hide();
            }
    }

    function showTitle(jsonresp) {
        let parsedResp = JSON.parse(jsonresp.responseText);
        let nume = parsedResp.informatii[0]['Nume'];
        let instructori = parsedResp.informatii[0]['Instructori'];
        let data = parsedResp.informatii[0]['Data'];
        let adresa = parsedResp.informatii[0]['Adresa'];
        let str = "Antrenament<br>Sala: " + nume + "<br>Instructor: " + instructori + "<br>Data desfasurare: " + data + "<br>Locatie: " + adresa;
        $("#titlu").html(str);
    }

    function addBoxInfo(jsonResponse) {
        try {
            let parsedResp = JSON.parse(jsonResponse.responseText);
            $("#antrnmnt_dropdownAdd").empty().append(new Option("-- Alegeti un utilizator --"));


            for (let i = 0; i < parsedResp.informatii.length; i++) {
                let opt = new Option(parsedResp.informatii[i]['Nume'] + ', ' + parsedResp.informatii[i]['Prenume'], i);
                $(opt).html(parsedResp.informatii[i]['Nume'] + ', ' + parsedResp.informatii[i]['Prenume']);
                $("#antrnmnt_dropdownAdd").append(opt);
            }
        } catch (e) {
            console.log(e.message);
        }
    }

    function initDropdown() {
        $.ajax(
            {
                url: '../php/dbHandler.php',
                method: 'GET',
                data: {
                    getAntrenamentInfo: 1,
                    id: idtkn
                },
                complete: function (response) { // success is not working; using complete as alternative
                    addBoxInfo(response);
                },
                dataType: 'text'
            }
        );
    }

    function initTable() {
        // TABLE AJAX
       $("#eventsTable").find("tr:gt(0)").remove();
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
    }

    function initDelButtons() {
        $("[id$='_del']").show().off('click').on('click', function () {
            if (confirm(deleteMessage)) {
                let id = $(this).attr('id').split("_")[1];
                $(this).parents('tr').remove();
                $.ajax(
                    {
                        url: '../php/dbHandler.php',
                        method: 'POST',
                        data: {
                            deleteRecordPresentUser: 1,
                            id: id
                        },
                        complete: function (response) { // success is not working; using complete as alternative
                            initTable();
                            initDropdown();
                        },
                        dataType: 'text'
                    }
                );
            }
        });
    }

    function initSelectButton() {
        $("#select_toggle").show().off('click').on('click', function () {
            let sel = $("#select_toggle");
            console.log(sel.html());
            if (sel.html() === 'Submit') { // IF I SUBMIT, DELETE ALL RECORDS CHECKED ONE BY ONE
                $("input[id^='checkBox_']").each(function () {
                    $(this).hide();
                    $("th").first().hide();
                    $("tr :first-child").hide();
                    if (!$(this).is(":checked"))
                        return;
                    let id = $(this).attr('id').split("_")[1];
                    $.ajax(
                        {
                            url: '../php/dbHandler.php',
                            method: 'POST',
                            data: {
                                deleteRecordPresentUser: 1,
                                id: id
                            },
                            complete: function (response) { // success is not working; using complete as alternative
                                initDropdown();
                                // TODO: DO SOMETHING HERE TOO
                            },
                            dataType: 'text'
                        }
                    );
                    $(this).parents('tr').remove(); // REMOVE THE LINE WHERE BOX IS CHECKED
                });
                sel.html("Select");
            } else if (sel.html() === 'Select') {
                $("th").first().show();
                $("input[id^='checkBox_']").parents("table").find('td').show();
                $("table").find('td:first-child').children().first().show();
                sel.html('Submit');
            }
        });
    }

    function initEditButton() {
        $("#editButton_toggle").css('visibility', 'visible').off('click').off('click').on('click', function () {
            if (counter === 0) {
                $("#hiddenForm").show().css('display', 'block');
                counter = 1;
            } else {
                $("#hiddenForm").hide().css('display', 'none');
                counter = 0;
            }
        })
    }

    function init() {
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
                        $("button[id$='_del']").show();
                        $("input[id^='checkBox_']").hide(); // DOES NOT WORK RIGHT NOW
                        initDelButtons();
                        initSelectButton();
                        initEditButton();
                    }
                }
            }
        );
    }

    init();
    initTable();
    initDropdown();

    // SEARCH
    $("#search").on("keyup", function () {
        let value = $(this).val().toLowerCase();

        $("table tr").each(function (index) {
            if (index !== 0) {
                let $row = $(this);

                let $tdElement = $row.find("td:eq(1)"); // CHECKS ON ROW 1(NAMES)
                let id = $tdElement.text().toLowerCase();
                let matchedIndex = id.indexOf(value);

                if (matchedIndex !== 0) { // IF WHAT IS TYPED IN SEARCH BOX MATCHES WORD FROM THE BEGINNING
                    $row.hide();
                } else {
                    $row.show();
                }
            }
        });
    });

    dragElement(document.getElementById("hiddenForm"));

    $("#newEvent_submit").off('click').on('click', function () {
        let user, nume, prenume;
        if ($("#antrnmnt_dropdownAdd").val === "-- Alegeti o sala --") {
            mustCompleteField("#signup_sala");
            return;
        } else {
            user = $("#antrnmnt_dropdownAdd option:selected").text();
            nume = user.split(", ")[0];
            prenume = user.split(", ")[1];
        }

        $.ajax(
            {
                url: '../php/dbHandler.php',
                method: 'POST',
                data: {
                    addUserAntrenament: 1,
                    id_antr: idtkn,
                    nume: nume,
                    prenume: prenume
                },
                complete: function (response) { // success is not working; using complete as alternative
                 //   init();
                    initTable();
                    initDropdown();
                },
                dataType: 'text'
            }
        );
    });

    // TITLE
    $.ajax(
        {
            url: '../php/dbHandler.php',
            method: 'GET',
            data: {
                getAntrenamentTitlu: 1,
                id: idtkn
            },
            complete: function (response) { // success is not working; using complete as alternative
                showTitle(response);
            },
            dataType: 'text'
        }
    );
    // DROPDOWN BOX INFO (Nume, Prenume)


});