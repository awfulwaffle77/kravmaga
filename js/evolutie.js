$(document).ready(function () {
    const code_isAdmin = 100;

    let userData;

    function checkAndGo() { // verifica daca e admin si daca da, initiaza dropdown, daca nu, arata graficul direct
        $.ajax(
            {
                url: '../php/dbHandler.php',
                method: 'POST',
                data: {
                    checkPrivilege: 1,
                },
                complete: function (response) { // success is not working; using complete as alternative
                    if (JSON.parse(response.responseText).code === code_isAdmin) {
                        initDropdown();
                        $("#choose").on("change",function () {
                            let name = $("#choose option:selected").text().split(" ")[0];
                            let surname = $("#choose option:selected").text().split(" ")[1];

                            // get all values for that name and surname
                            let dataForSelectedUser = [];
                            $.each(userData,function (i, val) {
                                if(val["Nume"] !== name || val["Prenume"] !== surname)
                                    return;
                                //console.log(val["Nume"] + " = " + name + val["Prenume"] + " = " + surname);
                                console.log(val["goal"]);
                                dataForSelectedUser.push({
                                    "goal": val["goal"],
                                    "deadline": val["deadline"],
                                    "date_assigned": val["date_assigned"]
                                });
                            });
                            drawGraph(createDataset(dataForSelectedUser));
                        });
                        initForm(getDBInfo());
                    } else
                        drawGraph(createDataset(userData));
                },
                dataType: 'text'
            });
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

    function initForm(jsonData) {
        for (let i = 0; i < jsonData['utilizatori'].length; i++) {
            let opt = new Option(jsonData['utilizatori'][i]['utilizator'], jsonData['utilizatori'][i]['id_utilizator']);
            $(opt).html(jsonData['utilizatori'][i]['utilizator']);
            $("#form_username").append(opt);
        }
        $("#hiddenForm").show();
        $("#form_submit").on('click',function () {
            let username = $("#form_username").val();
            let goal = $("#form_task").val();
            if(goal.length > 50)
                $("#task_err").text("Maxim 50 caractere!");
            let date = $("#form_data").val();
            let date_start = $("#form_data_start").val();

            $.ajax(
                {
                    url: '../php/dbHandler.php',
                    method: 'POST',
                    data: {
                        updateEvolutieTasks: 1,
                        username: username,
                        goal: goal,
                        date: date,
                        today: date_start
                    },
                    complete: function (response) { // success is not working; using complete as alternative
                        location.reload();
                    },
                    dataType: 'text'
                });
        });
    }
    
    function createDataset(data) {
        var colorSet = new am4core.ColorSet();
        let dataset = [];
        for (let i = 0; i < data.length; i++) {
            dataset.push(
                {
                    "category": "",
                    "color": colorSet.getIndex(i + 2),
                    "task": data[i]["goal"],
                    "start": data[i]["date_assigned"],
                    "end": data[i]["deadline"],
                }
            )
        }
        return dataset;
    }

    function drawGraph(userData) {
        am4core.ready(function() {

// Themes begin
            am4core.useTheme(am4themes_dark);
            am4core.useTheme(am4themes_animated);
// Themes end

            var chart = am4core.create("chartdiv", am4plugins_timeline.SerpentineChart);
            chart.curveContainer.padding(50, 20, 50, 20);
            chart.levelCount = 4;
            chart.yAxisRadius = am4core.percent(25);
            chart.yAxisInnerRadius = am4core.percent(-25);
            chart.maskBullets = false;

            var colorSet = new am4core.ColorSet();
            colorSet.saturation = 0.5;

            chart.data = userData;

            chart.dateFormatter.dateFormat = "yyyy-MM-dd";
            chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";
            chart.fontSize = 11;

            var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "category";
            categoryAxis.renderer.grid.template.disabled = true;
            categoryAxis.renderer.labels.template.paddingRight = 25;
            categoryAxis.renderer.minGridDistance = 10;
            categoryAxis.renderer.innerRadius = -60;
            categoryAxis.renderer.radius = 60;

            var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.renderer.minGridDistance = 70;
            dateAxis.baseInterval = { count: 1, timeUnit: "day" };
            dateAxis.renderer.tooltipLocation = 0;
            dateAxis.startLocation = -0.5;
            dateAxis.renderer.line.strokeDasharray = "1,4";
            dateAxis.renderer.line.strokeOpacity = 0.6;
            dateAxis.tooltip.background.fillOpacity = 0.2;
            dateAxis.tooltip.background.cornerRadius = 5;
            dateAxis.tooltip.label.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
            dateAxis.tooltip.label.paddingTop = 7;

            var labelTemplate = dateAxis.renderer.labels.template;
            labelTemplate.verticalCenter = "middle";
            labelTemplate.fillOpacity = 0.7;
            labelTemplate.background.fill = new am4core.InterfaceColorSet().getFor("background");
            labelTemplate.background.fillOpacity = 1;
            labelTemplate.padding(7, 7, 7, 7);

            var series = chart.series.push(new am4plugins_timeline.CurveColumnSeries());
            series.columns.template.height = am4core.percent(20);
            series.columns.template.tooltipText = "{task}: [bold]{openDateX}[/] - [bold]{dateX}[/]";

            series.dataFields.openDateX = "start";
            series.dataFields.dateX = "end";
            series.dataFields.categoryY = "category";
            series.columns.template.propertyFields.fill = "color"; // get color from data
            series.columns.template.propertyFields.stroke = "color";
            series.columns.template.strokeOpacity = 0;

            var bullet = series.bullets.push(new am4charts.CircleBullet());
            bullet.circle.radius = 3;
            bullet.circle.strokeOpacity = 0;
            bullet.propertyFields.fill = "color";
            bullet.locationX = 0;


            var bullet2 = series.bullets.push(new am4charts.CircleBullet());
            bullet2.circle.radius = 3;
            bullet2.circle.strokeOpacity = 0;
            bullet2.propertyFields.fill = "color";
            bullet2.locationX = 1;


            var imageBullet1 = series.bullets.push(new am4plugins_bullets.PinBullet());
            imageBullet1.disabled = true;
            imageBullet1.propertyFields.disabled = "disabled1";
            imageBullet1.locationX = 1;
            imageBullet1.circle.radius = 20;
            imageBullet1.propertyFields.stroke = "color";
            imageBullet1.background.propertyFields.fill = "color";
            imageBullet1.image = new am4core.Image();
            imageBullet1.image.propertyFields.href = "image1";

            var imageBullet2 = series.bullets.push(new am4plugins_bullets.PinBullet());
            imageBullet2.disabled = true;
            imageBullet2.propertyFields.disabled = "disabled2";
            imageBullet2.locationX = 0;
            imageBullet2.circle.radius = 20;
            imageBullet2.propertyFields.stroke = "color";
            imageBullet2.background.propertyFields.fill = "color";
            imageBullet2.image = new am4core.Image();
            imageBullet2.image.propertyFields.href = "image2";


            var eventSeries = chart.series.push(new am4plugins_timeline.CurveLineSeries());
            eventSeries.dataFields.dateX = "eventDate";
            eventSeries.dataFields.categoryY = "category";
            eventSeries.strokeOpacity = 0;

            var flagBullet = eventSeries.bullets.push(new am4plugins_bullets.FlagBullet())
            flagBullet.label.propertyFields.text = "letter";
            flagBullet.locationX = 0;
            flagBullet.tooltipText = "{description}";

            chart.scrollbarX = new am4core.Scrollbar();
            chart.scrollbarX.align = "center"
            chart.scrollbarX.width = am4core.percent(85);

            var cursor = new am4plugins_timeline.CurveCursor();
            chart.cursor = cursor;
            cursor.xAxis = dateAxis;
            cursor.yAxis = categoryAxis;
            cursor.lineY.disabled = true;
            cursor.lineX.strokeDasharray = "1,4";
            cursor.lineX.strokeOpacity = 1;

            dateAxis.renderer.tooltipLocation2 = 0;
            categoryAxis.cursorTooltipEnabled = false;


        }); // end am4core.ready()
    }

    function initDropdown() {
        try {
            // get unique name
            let flags = [], uniqueNames = [], l = userData.length, i;
            for (i = 0; i < l; i++) {
                if (flags[userData[i]["ID_utilizator"]]) continue;
                flags[userData[i]["ID_utilizator"]] = true;
                uniqueNames.push(userData[i]);
            }

            $.each(uniqueNames, function (index, val) {
                let str = this["Nume"] + " " + this["Prenume"];
                let opt = new Option(str, index);
                $(opt).html(str);
                $("#choose").append(opt);
            });
            $("#choose").show();
        } catch (e) {
            console.log(e + "There was an error fetching info from the server");
        }
    }

    $.ajax(
        {
            url: '../php/dbHandler.php',
            method: 'GET',
            data: {
                getEvolutionData: 1,
            },
            complete: function (response) { // success is not working; using complete as alternative
                console.log(response.responseText);
                userData = JSON.parse(response.responseText);
                checkAndGo();
            },
            dataType: 'text'
        });

});