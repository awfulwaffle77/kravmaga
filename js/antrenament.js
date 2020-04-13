import {getUrlParameter} from './handler.js'
import {dragElement} from "./fieldChecker.js";
import {code_isAdmin} from "./handler.js";

$(document).ready(function () {

    let idtkn = getUrlParameter('id');
    const deleteMessage = "Vrei sa stergi acest eveniment?";

    function handleInfo(jsonResponse) {
        console.log(jsonResponse.responseText);
        let parsedResp = JSON.parse(jsonResponse.responseText);

        for (let i = 0; i < parsedResp.informatii.length; i++) {
            let id = parsedResp.informatii[i]["ID_utilizator"];
            let nume = parsedResp.informatii[i]["Nume"];
            let prenume = parsedResp.informatii[i]["Prenume"];

            let buttonDel = '<button id="delButton_' + id + '_del" style="visibility: hidden; float: right; margin-top: 10px"> Delete</button>';
            let trInsert = '<tr><td>' + nume + '</td><td>' + prenume + '</td><td>' + buttonDel + '</td></tr>';
            $("#eventsTable tr:last").after(trInsert); // ADDS AFTER LAST TR
        }
    }

    // SEARCH CONTROLS
    function removeHighlighting(highlightedElements){
        highlightedElements.each(function(){
            var element = $(this);
            element.replaceWith(element.html());
        })
    }

    function addHighlighting(element, textToHighlight){
        var text = element.text();
        var highlightedText = '<em>' + textToHighlight + '</em>';
        var newText = text.replace(textToHighlight, highlightedText);

        element.html(newText);
    }

    $("#search").on("keyup", function() {
        var value = $(this).val();

        removeHighlighting($("table tr em"));

        $("table tr").each(function(index) {
            if (index !== 0) {
                let $row = $(this);

                var $tdElement = $row.find("td:first");
                var id = $tdElement.text();
                var matchedIndex = id.indexOf(value);

                if (matchedIndex !== 0) {
                    $row.hide();
                }
                else {
                    addHighlighting($tdElement, value);
                    $row.show();
                }
            }
        });
    });

    dragElement(document.getElementById("hiddenForm"));

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

                        if (confirm(deleteMessage)) {
                            let id = $(this).attr('id').split("_")[1];
                            $(this).parents('tr').remove();
                            $.ajax(
                                {
                                    url: '../php/dbHandler.php',
                                    method: 'POST',
                                    data: {
                                        //////////////////////////////////////////////////////////////// CHANGE TO USERS
                                        deleteRecordPresentUser: 1,
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
                }
            }
        }
    );
});