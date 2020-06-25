var ajax = new XMLHttpRequest();
var method = "GET";
var url = 'php/index.php';
var asynchronus = true;

ajax.open(method, url, asynchronus);
ajax.send();

var dates = {
    convert: function(d) {

        return (
            d.constructor === Date ? d :
            d.constructor === Array ? new Date(d[0], d[1], d[2]) :
            d.constructor === Number ? new Date(d) :
            d.constructor === String ? new Date(d) :
            typeof d === "object" ? new Date(d.year, d.month, d.date) :
            NaN
        );
    },
    compare: function(a, b) {

        return (
            isFinite(a = this.convert(a).valueOf()) &&
            isFinite(b = this.convert(b).valueOf()) ?
            (a > b) - (a < b) :
            NaN
        );
    },
    inRange: function(d, start, end) {

        return (
            isFinite(d = this.convert(d).valueOf()) &&
            isFinite(start = this.convert(start).valueOf()) &&
            isFinite(end = this.convert(end).valueOf()) ?
            start <= d && d <= end :
            NaN
        );
    }
}



ajax.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.responseText);


        var today = Date.now();
        var last = Array();
        var next = Array();

        var html = "";
        for (var i = 0; i < data.length; i++) {
            var numeev = data[i].Nume;
            var data_ev = data[i].Data_start_eveniment;
            var tip_eveniment = data[i].Tip_eveniment;
            var data_ = new Date(data_ev);
            if (dates.compare(today, data_) < 0) {
                let event = { "nume": numeev, "data": data_ev, "tip": tip_eveniment };
                next.push(event);
            }
            if (dates.compare(today, data_) == 0) {
                let event = { "nume": numeev, "data": data_ev, "tip": tip_eveniment };
                next.push(event);
            }
            if (dates.compare(today, data_) > 0) {
                let event = { "nume": numeev, "data": data_ev, "tip": tip_eveniment };
                last.push(event);
            }
        }


        var length_last = last.length;
        var length_next = next.length;




        html += '<div class="ev">  <img class="imge" src="img/logo_cartfil.png">  <p class="ev1">';
        html += last[length_last - 2].tip + '<br>' + last[length_last - 2].nume;
        html += '</p> <p class="dataev">'
        html += last[length_last - 2].data;
        html += '</div>';


        html += '<div class="ev">  <img class="imge" src="img/logo_cartfil.png">  <p class="ev1">';
        html += last[length_last - 1].tip + '<br>' + last[length_last - 1].nume;
        html += '</p> <p class="dataev">'
        html += last[length_last - 1].data;
        html += '</div>';

        if (length_next >= 2) {
            html += '<div class="ev">  <img class="imge" src="img/logo_cartfil.png">  <p class="ev1">';
            html += next[1].tip + '<br>' + next[1].nume;
            html += '</p> <p class="dataev">'
            html += next[1].data;
            html += '</div>';

            html += '<div class="ev">  <img class="imge" src="img/logo_cartfil.png">  <p class="ev1">';
            html += next[2].tip + '<br>' + next[2].nume;
            html += '</p> <p class="dataev">'
            html += next[2].data;
            html += '</div>';

        } else if (length_next == 1) {
            html += '<div class="ev">  <img class="imge" src="img/logo_cartfil.png">  <p class="ev1">';
            html += next[1].tip + '<br>' + next[1].nume;
            html += '</p> <p class="dataev1">'
            html += next[1].data;
            html += '</div>';
        }




        document.getElementById("evenimente").innerHTML = html;
    }
}