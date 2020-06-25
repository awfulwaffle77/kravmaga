$(document).ready(function() {

    function initTable(json) {
        for (let i = 0; i < json.length; i++) {
            let row = "<tr><td>" + json[i]['culoare'] + "</td><td>" + json[i]['denumire'] + "</td><td>" + json[i]['semnificatie'] + "</td><td>" + json[i]['cost'] + "</td><td><a href=" + json[i]['documentatie'] + " target='blank_'>link</a></td></tr>";
            $("table:last-child").append(row);
        }
    }

    $.ajax({
        url: '../php/dbHandler.php',
        method: 'GET',
        data: {
            getCenturi: 1,
        },
        complete: function(response) { // success is not working; using complete as alternative
            initTable(response.responseJSON);
            console.log(response.responseJSON);
        },
        dataType: 'json',
    });
});