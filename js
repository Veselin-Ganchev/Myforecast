$(document).ready(function() {


//INPUT AND SUBMIT

    $(function() {
        $(":text").keydown(function() {
            if ($(this).val().length < 2) {
                $(":submit").attr("disabled", true);
            } else {
                $(":submit").removeAttr("disabled");
            }
        });
    });

    var city;

    $(':submit').click(function () {
      city = $(':text').val();
      getForecast();

    });

// SEARCH HISTORY

    var cityHistory = [];

    if (localStorage.getItem('lastSearch')) {
        cityHistory = JSON.parse(localStorage.getItem('lastSearch'));
    }
    function showHistory() {
        while (cityHistory.length > 5){
            cityHistory.pop();
        }

        var hisCity = '';
        var i = 0;

        while (cityHistory[i]){
        hisCity += '<div></div><a href="javascript:;">' + cityHistory[i] + '</a></div>';
        i++;
        $('.history').html(hisCity);
        }

        $('.history a').click(function () {
            city = $(this).text();
            $('#cityName').val(city);
            getForecast();
        });
    }

    showHistory();

    function newCity() {
        cityHistory.unshift($('#cityName').val());
        localStorage.setItem('lastSearch', JSON.stringify(cityHistory));
        showHistory();
    }

//FORECAST TOGGLE
    $('.weekToggle').click(function () {
        $('#todayFcast').hide();
        $('#fCastTable').show();
    });

    $('.todayToggle').click(function () {
        $('#fCastTable').hide()
        $('#todayFcast').show();
    });

    $('.infoTogTwo').click(function () {
        var text = $('.infoTogTwo .btn-primary').text() == 'today' ? '7 days forecast' : 'today';
        $('.infoTogTwo .btn-primary')
            .text(text)
            .toggleClass("active");

        $(' #fCastTable , #todayFcast').toggle();
    });

//API CALL
    var $loading = $('#loadImg').hide();

    function getForecast() {
        $loading.show();
        $('.icon').hide();
        $.ajax({
            method: "GET",
            url: 'https://api.apixu.com/v1/forecast.json?key=6cc0a4aca1d74a2884b111121181912&q=' + city + '&days=7',
            dataType: "json",
            error: function() {
                $('#weatherWrap').hide();
                $('#error').show();
                $loading.hide();
                $('.icon').show();
            },
            success: function getforecast(data) {
                $loading.hide();
                $('.icon').show();

                newCity();
                $('#searchLoc').hide();
                $('#weatherApp').show();

                $('.cityName').html(city);
                $('.weatherIcon').attr("src", 'http:' + data.current.condition.icon );
                $('.temperature').html(data.current.temp_c + '&#176;');
                $('.timeDate').html(data.location.localtime);
                $('.condition').html(data.current.condition.text);
                $('.feelsTemp').html(data.current.feelslike_c + ' &#176;');
                $('.windSpd').html(data.current.wind_kph + ' km/h');
                $('.humidity').html(data.current.humidity + ' %');

            //  TABLE GENERATOR
                var rows = '';


                for (i = 0; i <= data.forecast.forecastday.length; i++) {
                    var dayFc = data.forecast.forecastday[i];
                    var condIcon = 'http:' + dayFc.day.condition.icon;
                    var condText = dayFc.day.condition.text;
                    var rowInsert = '<tr>'+'<td>'+'<span class="dayDate">'+dayFc.date+'</span>'+'</td>'+'<td>'+'<img src="'+condIcon+'">'+'<span class="dayTemp">'+dayFc.day.avgtemp_c+' &#176;' + 'C ' + '</span>'+'<span class="conText">'+condText+'</span>'+'</td>'+'</tr>';
                    rows += rowInsert;
                    createTable();
                }
                function createTable(){
                    $('#dateForc').html(rows);
                }
            },
        });
    }

//ERROR BACK BUTTON
    $('.backBtn').click(function () {
        $('#error').hide();
        $('#weatherWrap').show();
    });

});


