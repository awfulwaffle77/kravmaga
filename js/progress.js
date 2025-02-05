import {code_isAdmin} from "./handler.js";

$(document).ready(function () {
    let dataset = [];
    let dbInfo = []; // array of Usernames and Centuri

    function createData(data) {
        //dataset = data;
        let end;
        let colorSet = new am4core.ColorSet();
        for (let i = 0; i < data.length; i++) {
            let start = data[i]["Data_obtinere"];

            if (i === data.length - 1) {
                end = moment().format("YYYY-MM-DD");
            } else
                end = data[i + 1]["Data_obtinere"];
            dataset.push({
                "category": "",
                "textDisabled": false,
                "text": data[i]['Prenume'] + " " + data[i]['Nume'] + " a obținut centura " + data[i]['Culoare'],
                "color": colorSet.getIndex(i + 2),
                "start": start,
                "end": end
            })
        }
        return dataset;
    }

    function getDBInfo() {
        let resp;
        $.ajax(
            {
                url: '../php/dbHandler.php',
                method: 'GET',
                data: {
                    getProgressInfo: 1,
                },
                complete: function (response) { // success is not working; using complete as alternative
                    resp = response.responseJSON;
                },
                dataType: 'json',
                async: false
            });
        return resp;
    }

    function initFormData(jsonData) {
        console.log(jsonData);
        try {
            for (let i = 0; i < jsonData['utilizatori'].length; i++) {
                let opt = new Option(jsonData['utilizatori'][i]['utilizator'], jsonData['utilizatori'][i]['id_utilizator']);
                $(opt).html(jsonData['utilizatori'][i]['utilizator']);
                $("#form_username").append(opt);
            }
            for (let i = 0; i < jsonData['centuri'].length; i++) {
                let opt = new Option(jsonData['centuri'][i]['culoare'], jsonData['centuri'][i]['ID_centura']);
                $(opt).html(jsonData['centuri'][i]['culoare']);
                $("#form_centura").append(opt);
            }
        }
        catch(e){
            console.log(e + "There was an error fetching info from the server");
        }
    }

    function addData() {
        let username = $("#form_username").val();
        let centura = $("#form_centura").val();
        let data = $("#form_data").val();

        $.ajax(
            {
                url: '../php/dbHandler.php',
                method: 'POST',
                data: {
                    addProgressInfo: 1,
                    username: username,
                    centura: centura,
                    data: data
                },
                complete: function (response) { // success is not working; using complete as alternative
                    location.reload();
                },
                dataType: 'text',
            });
    }

    $.ajax({
        url: '../php/dbHandler.php',
        method: 'GET',
        data: {
            getBeltProgress: 1,
        },
        complete: function (response) { // success is not working; using complete as alternative
            try {
                dataset = createData(JSON.parse(response.responseText));
                am4core.ready(function () {

// Themes begin
                    am4core.useTheme(am4themes_dark);
// Themes end

                    var chart = am4core.create("chartdiv", am4plugins_timeline.SerpentineChart);
                    chart.curveContainer.padding(100, 20, 50, 20);
                    chart.levelCount = 3;
                    chart.yAxisRadius = am4core.percent(20);
                    chart.yAxisInnerRadius = am4core.percent(2);
                    chart.maskBullets = false;

                    var colorSet = new am4core.ColorSet();

                    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd HH:mm";
                    chart.dateFormatter.dateFormat = "HH";

                    chart.data = dataset;

                    chart.fontSize = 10;
                    chart.tooltipContainer.fontSize = 10;

                    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
                    categoryAxis.dataFields.category = "category";
                    categoryAxis.renderer.grid.template.disabled = true;
                    categoryAxis.renderer.labels.template.paddingRight = 25;
                    categoryAxis.renderer.minGridDistance = 10;

                    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
                    dateAxis.renderer.minGridDistance = 70;
                    dateAxis.baseInterval = {count: 30, timeUnit: "minute"};
                    dateAxis.renderer.tooltipLocation = 0;
                    dateAxis.renderer.line.strokeDasharray = "1,4";
                    dateAxis.renderer.line.strokeOpacity = 0.5;
                    dateAxis.tooltip.background.fillOpacity = 0.2;
                    dateAxis.tooltip.background.cornerRadius = 5;
                    dateAxis.tooltip.label.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
                    dateAxis.tooltip.label.paddingTop = 7;
                    dateAxis.endLocation = 0;
                    dateAxis.startLocation = -0.5;

                    var labelTemplate = dateAxis.renderer.labels.template;
                    labelTemplate.verticalCenter = "middle";
                    labelTemplate.fillOpacity = 0.4;
                    labelTemplate.background.fill = new am4core.InterfaceColorSet().getFor("background");
                    labelTemplate.background.fillOpacity = 1;
                    labelTemplate.padding(7, 7, 7, 7);

                    var series = chart.series.push(new am4plugins_timeline.CurveColumnSeries());
                    series.columns.template.height = am4core.percent(15);

                    series.dataFields.openDateX = "start";
                    series.dataFields.dateX = "end";
                    series.dataFields.categoryY = "category";
                    series.baseAxis = categoryAxis;
                    series.columns.template.propertyFields.fill = "color"; // get color from data
                    series.columns.template.propertyFields.stroke = "color";
                    series.columns.template.strokeOpacity = 0;
                    series.columns.template.fillOpacity = 0.6;

                    var imageBullet1 = series.bullets.push(new am4plugins_bullets.PinBullet());
                    imageBullet1.locationX = 1;
                    imageBullet1.propertyFields.stroke = "color";
                    imageBullet1.background.propertyFields.fill = "color";
                    imageBullet1.image = new am4core.Image();
                    imageBullet1.image.propertyFields.href = "icon";
                    imageBullet1.image.scale = 0.5;
                    imageBullet1.circle.radius = am4core.percent(100);
                    imageBullet1.dy = -5;


                    var textBullet = series.bullets.push(new am4charts.LabelBullet());
                    textBullet.label.propertyFields.text = "text";
                    textBullet.disabled = true;
                    textBullet.propertyFields.disabled = "textDisabled";
                    textBullet.label.strokeOpacity = 0;
                    textBullet.locationX = 1;
                    textBullet.dy = -100;
                    textBullet.label.textAlign = "middle";

                    chart.scrollbarX = new am4core.Scrollbar();
                    chart.scrollbarX.align = "center"
                    chart.scrollbarX.width = am4core.percent(75);
                    chart.scrollbarX.opacity = 0.5;

                    var cursor = new am4plugins_timeline.CurveCursor();
                    chart.cursor = cursor;
                    cursor.xAxis = dateAxis;
                    cursor.yAxis = categoryAxis;
                    cursor.lineY.disabled = true;
                    cursor.lineX.strokeDasharray = "1,4";
                    cursor.lineX.strokeOpacity = 1;

                    dateAxis.renderer.tooltipLocation2 = 0;
                    categoryAxis.cursorTooltipEnabled = false;


                    var label = chart.createChild(am4core.Label);
                    label.text = "Progresul centurilor"
                    label.isMeasured = false;
                    label.y = am4core.percent(40);
                    label.x = am4core.percent(50);
                    label.horizontalCenter = "middle";
                    label.fontSize = 20;

                }); // end am4core.ready()

            } catch (e) {
                console.log(response.responseText);
            }
        },
        dataType: 'text'
    });

    $.ajax(
        {
            url: '../php/dbHandler.php',
            method: 'POST',
            data: {
                checkPrivilege: 1,
            },
            complete: function (response) { // success is not working; using complete as alternative
                if (JSON.parse(response.responseText).code === code_isAdmin) {
                    $("#hiddenForm").show();
                    initFormData(getDBInfo());
                    $("#form_submit").on('click', addData);
                }
            },
            dataType: 'text'
        });

});