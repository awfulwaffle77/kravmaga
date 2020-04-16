import {code_isAdmin} from "./handler.js";
import {dragElement} from "./fieldChecker.js";

$(document).ready(function () {

    let counter = 0;

    const deleteMessage = "Vrei sa stergi acest antrenament?";

    function handleInfo(jsonResponse){
        //console.log(jsonResponse.responseText);
        let parsedResp = JSON.parse(jsonResponse.responseText);

        for(let i = 0;i < parsedResp.informatii.length; i++) {
            let href = '"' + "https://localhost/kravmaga_v2/pages/antrenament.html";
            let id = parsedResp.informatii[i]['ID_Antrenament'];
            href += "?id=" + id + '"';
            let nume = parsedResp.informatii[i]['Nume'];
            let adresa = parsedResp.informatii[i]['Adresa'];
            let instructori = parsedResp.informatii[i]['Instructori'];
            let data = parsedResp.informatii[i]['Data'];

            let buttonEdit = '<button id="editButton_' + id + '_edit" style="visibility: hidden; float: right; margin-top: 10px">Edit</button>';
            let buttonDel = '<button id="delButton_' + id + '_del" style="visibility: hidden; float: right; margin-top: 10px">Delete</button>';
            let trInsert = '<tr><td><a href= ' + href + '>' + nume + '</a></td><td><a href=' + href + '>' + adresa + '</a></td><td><a href=' + href + '>' + instructori + '</td><td><a href=' + href + '>' + data + '</a></td><td>' + buttonEdit + '</td><td>' + buttonDel + '</td></tr>';
            $("#antrnmntTable tr:last").after(trInsert); // ADDS AFTER LAST TR
        }
    }

    // NOT REALLY SURE WHAT THIS DOES. IT IS IN CONTEXT OF SINGLE CLICKABLE ROW
    $("td > a").on("click",function(e){
        e.stopPropagation();
    });

    dragElement(document.getElementById("hiddenForm"));

    $.ajax(
        {
            url: '../php/dbHandler.php',
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
            url: '../php/dbHandler.php',
            method: 'POST',
            data: {
                checkPrivilege: 1,
            },
            complete: function (response) { // success is not working; using complete as alternative
                let x = JSON.parse(response.responseText);
                if(x.code === code_isAdmin){
                    $("button[id$='_del']").css('visibility', 'visible').on('click', function () {
                        if (confirm(deleteMessage)){
                            let id = $(this).attr('id').split("_")[1];
                            $(this).parents('tr').remove();
                            $.ajax(
                                {
                                    url: '../php/dbHandler.php',
                                    method: 'POST',
                                    data: {
                                        deleteRecordAntrenamente: 1,
                                        id: id
                                    },
                                    complete: function (response) { // success is not working; using complete as alternative
                                        // TODO: DO SOMETHING HERE TOO
                                        handleInfo(response);
                                    },
                                    dataType: 'text'
                                }
                            );
                        }
                    });
                    $("button[id$='_edit']").css('visibility', 'visible').on('click', function () {
                        let currentTD = $(this).parents('tr').find('a').slice(2); // DUE TO THE IMPLEMENTATION OF updateAntrenamente, THE FIRST TWO ROWS ARE NOT EDITABLE
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
                                        updateAntrenamente: id, // MUST BE ID OF EVENT
                                        updatedInfo: updatedInfo
                                    },
                                    complete: function (response) { // success is not working; using complete as alternative
                                        // TODO: DO SOMETHING HERE
                                        handleInfo(response);
                                    },
                                    dataType: 'text'
                                }
                            );
                        }

                        $(this).html($(this).html() === 'Edit' ? 'Save' : 'Edit')

                    });
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