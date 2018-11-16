$(document).ready(function () {

    var myCity;
    var days = ['NON','MON','TUE','WED','THU','FRI','SAT','SUN','MON','TUE','WED'];
    var date = new Date();
    var day = date.getDay();

    //get location
    jQuery.get("http://ipinfo.io", function(response) {
            $('#location').text(response.city);
            myCity = response.city;
            if (myCity == ""){
                myCity = "sofia";
            }
            getForecast();
        }, "jsonp"
    );

    //Hint
    $('#hint').delay(1000).fadeIn('slow');
    $('#hint').delay(3000).fadeOut('slow');

    //change location
    $("#getCity").submit(function(e){
        return false;
    });

    var replace = function () {
        $('#getCity').toggle(50);
        $('#locationWrap').toggle(50);
    };

    $('.location-icon, #location').click(replace);

    $('#subCity').click(function newCity() {
        if ($('#cityInput').val() == ""){
            $('#cityInput').css( "background-color", "rgba(200, 63, 42, 0.5)" );
            return false;
        }else {
            myCity = $('#cityInput').val();
        }
        getForecast();
        replace();
    });


    function getForecast() {
        $.ajax({
            method: "GET",
            url: 'http://api.openweathermap.org/data/2.5/weather?q='+ myCity +'&APPID=28b2e202aea2eac55edf24ca78a50ea5&units=metric',
            dataType: "jsonp",
            success: function getforecast(data) {

            //icon for the current weather
                var weatherIconCode = data.weather[0].icon;
                var weatherIcon = "http://openweathermap.org/img/w/" + weatherIconCode + ".png";

                $('.icon').css(
                    "background-image", "url("+weatherIcon+")"
                );

            //weather info
                $('#location').html(myCity);
                $('.temperature').html(Math.floor(data.main.temp) + ' &#176;' + 'C');
                $('.condition').html(data.weather[0].description);
                $('.minTemp').html(data.main.humidity + ' %');
                $('.maxTemp').html(data.main.pressure + ' hPa');
                $('.wind').html(data.wind.speed + ' km/h');
            }
        });

        $.ajax({
            method: "GET",
            url: 'http://api.openweathermap.org/data/2.5/forecast?q='+ myCity +',bg&mode=xml&appid=28b2e202aea2eac55edf24ca78a50ea5&units=metric',
            dataType: "jsonp",
            success: function (data) {
            //weather after one day
                var weatherOne = data.list[7].weather[0].icon;
                var weatherOneIcon = "http://openweathermap.org/img/w/" + weatherOne + ".png";
                $('.dateAfterOne').html(days[1 + day]);
                $('.tempAfterOne').html(Math.floor(data.list[7].main.temp)+'<sup>&#176;</sup>');
                $('.iconAfterOne').css(
                    "background-image", "url("+weatherOneIcon+")"
                );
                $('.mainAfterOne').html(data.list[7].weather[0].main)
            //weather after two days
                var weatherOne = data.list[15].weather[0].icon;
                var weatherOneIcon = "http://openweathermap.org/img/w/" + weatherOne + ".png";
                $('.dateAfterTwo').html(days[2 + day]);
                $('.tempAfterTwo').html(Math.floor(data.list[15].main.temp)+'<sup>&#176;</sup>');
                $('.iconAfterTwo').css(
                    "background-image", "url("+weatherOneIcon+")"
                );
                $('.mainAfterTwo').html(data.list[15].weather[0].main)
            //weather after three days
                var weatherOne = data.list[23].weather[0].icon;
                var weatherOneIcon = "http://openweathermap.org/img/w/" + weatherOne + ".png";
                $('.dateAfterThree').html(days[3 + day]);
                $('.tempAfterThree').html(Math.floor(data.list[23].main.temp)+'<sup>&#176;</sup>');
                $('.iconAfterThree').css(
                    "background-image", "url("+weatherOneIcon+")"
                );
                $('.mainAfterThree').html(data.list[23].weather[0].main)
            }
        });
    };

});
