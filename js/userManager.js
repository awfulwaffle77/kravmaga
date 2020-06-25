import {code_isAdmin} from "./handler.js";

$(document).ready(function () {
    const deleteMessage = "Vrei sa stergi acest user?";

    function createUsersTable(jsonResponse) {
        // FACEM UN TABEL AICI
        //console.log(jsonResponse.responseText);
        let parsedResp = JSON.parse(jsonResponse.responseText);

        for (let i = 0; i < parsedResp.length; i++) {
            let id = parsedResp[i]['id_utilizator'];
            let nume = parsedResp[i]['nume'];
            let locatie = parsedResp[i]['adresa'];
            let nume_sala = parsedResp[i]['nume_sala'];
            let prenume = parsedResp[i]['prenume'];
            let data_inrolare = parsedResp[i]['data_inrolare'];
            let email = parsedResp[i]['email'];
            let culoare = parsedResp[i]['culoare'];
            let utilizator = parsedResp[i]['utilizator'];

            let buttonEdit = '<button id="editButton_' + id + '_edit" style="visibility: hidden; float: right; margin-top: 10px"> Edit</button>';
            let buttonDel = '<button id="delButton_' + id + '_del" style="visibility: hidden; float: right; margin-top: 10px"> Delete</button>';
            let trInsert = '<tr><td>' + nume + '</td><td>' + prenume + '</td><td>' + utilizator + '</td><td>' + email + '</td><td>' + data_inrolare + '</td><td>' + nume_sala + ", " + locatie + '</td><td>' + culoare + '</td><td>' + buttonEdit + '</td><td>' + buttonDel + '</td></tr>';
            $("#users tr:last").after(trInsert); // ADDS AFTER LAST TR
        }
    }

    function getAndCreate() { // gets users and creates the table
        $.ajax(
            {
                url: '../php/dbHandler.php',
                method: 'GET',
                data: {
                    getUsers: 1
                },
                complete: function (response) {
                    console.log(JSON.parse(response.responseText));
                    createUsersTable(response);
                    buttonEvents();
                },
                dataType: 'text',
            });
    }

    function buttonEvents() {
        $("button[id$='_del']").css('visibility', 'visible').on('click', function () {

            if (confirm(deleteMessage)) {
                let id = $(this).attr('id').split("_")[1];
                $(this).parents('tr').remove();
                $.ajax({
                    url: '../php/dbHandler.php',
                    method: 'POST',
                    data: {
                        deleteUser: 1,
                    },
                    complete: function (response) { // success is not working; using complete as alternative
                        // TODO: DO SOMETHING HERE TOO
                        console.log(response.responseText);
                        createUsersTable(response);
                    },
                    dataType: 'text'
                });
            }
        });
        // ATENTIE!!! Daca se editeaza numele de utilizator, update-ul nu o sa mearga!!!
        $("button[id$='_edit']").css('visibility', 'visible').on('click', function () {
            let currentTD = $(this).parents('tr').find('td');
            if ($(this).html() === 'Edit') {
                $.each(currentTD, function () {
                    // conditie aici pentru skip daca e row-ul de user
                    $(this).prop('contenteditable', true)
                });
            } else if ($(this).html() === 'Save') {
                let id = $(this).attr('id').split("_")[1];
                let updatedInfo = [];
                $.each(currentTD, function () {
                    $(this).prop('contenteditable', false);
                    updatedInfo.push($(this).html());
                });
                $.ajax({
                    url: '../php/dbHandler.php',
                    method: 'POST',
                    data: {
                        updateUser: 1,
                        updatedInfo: updatedInfo
                    },
                    complete: function (response) { // success is not working; using complete as alternative
                        // TODO: DO SOMETHING HERE
                        createUsersTable(response);
                    },
                    dataType: 'text'
                });
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

    $.ajax({
        url: '../php/dbHandler.php',
        method: 'POST',
        data: {
            checkPrivilege: 1,
        },
        complete: function (response) { // success is not working; using complete as alternative
            let x = JSON.parse(response.responseText);
            if (x.code === code_isAdmin) {
                getAndCreate();
            }
        },
        dataType: 'text'
    });

});