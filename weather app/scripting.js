$(document).ready(function() {
        /** GLOBAL DECLARATIONS **/
        const weatherBoard = "<div class='vertical-container'>" + "<div class='inner-test'>" + "<div class='place-and-temp'>" + "<div class='place'>" + "<div class='place-text'>" + "</div>" + "</div>" + "<div class='temp-and-switch'>" + "<div class='temp'>" + "<div class='temp-text'>" + "</div>" + "</div>" + "<div class='switchy'>" + "<div class='switch-pic'>" + "<p>&#176;C<label class='switch'><input type='checkbox'><span id='toggle' class='slider round' data-on='On' data-off='Off'></span></label>&#176;F</p>" + "</div>" + "</div>" + "<div class='humidity'>" + "<div class='humidity-text'>" + "</div>" + "</div>" + "</div>" + "</div>" + "<div class='icon'>" + "<div class='icon-text'>" + "</div>" + "</div>" + "<div class='description'>" + "<div class='description-text'>" + "</div>" + "</div>" + "<div class='time'>" + "<div class='time-text'>" + "</div>" + "</div>" + "<div class='refresh'>" + "<div class='refresh-button'>" + "<i class='fa fa-refresh' aria-hidden='true'></i>" + "</div>" + "</div>" + "</div>" + "</div>";

        //function to check if session storage available
        function checkStorage() {
                return Modernizr.sessionstorage;
        }

        //store result of storage availability function in variable
        var storageAvailable = checkStorage();

        //function to get weather at user's location
        function getWeather(lat, lon) {
                $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&APPID=3f82316c343df650f0204bf9dfaf2b42&units=metric", function(data) {
                        //store JSON data if available
                        if (storageAvailable) {
                                sessionStorage.weatherJSON = JSON.stringify(data);
                                sessionStorage.id = data.weather[0].id;
                        }
                        displayWeatherInfo(data);
                });
        }

        //function to get time at user's location
        function getTime() {
                var date = new Date(), time = date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}), hours = date.getHours();
                        //store JSON data if available
                        if (storageAvailable) {
                                sessionStorage.time = time;
                                sessionStorage.date = date.getTime();
                                sessionStorage.hours = hours;
                        }
        }

        //function to select background according to time and weather
        function chooseBackground(hours, id) {
                console.log(id === 800);
                var night = (hours < 5 || hours > 18);
                //clear skies
                ((id === 800) && night) ? $("body").css({"backgroundImage":"url('images/clear night sky.jpg')"}) : $("body").css({"backgroundImage":"url('images/sunny.jpg')"});
                //few clouds
                ((id === 801) && night) ? $("body").css({"backgroundImage":"url('images/cloudy night.jpg')"}) : $("body").css({"backgroundImage":"url('images/cloudy.jpg')"});
                //heavier clouds
                ((id >= 802 && id <= 804) && night) ? $("body").css({"backgroundImage":"url('images/cloudy night.jpg')"}) : $("body").css({"backgroundImage":"url('images/dark cloud.jpg')"});
                //thunderstorm
                if (id >= 200 && id <= 232)
                        $("body").css({"backgroundImage":"url('images/thunderstorm.jpg')"});
                //drizzle and rain
                if (id >= 300 && id <= 531)
                        $("body").css({"backgroundImage":"url('images/rain.jpg')"});
                //snow
                if (id >= 600 && id <= 622)
                        $("body").css({"backgroundImage":"url('images/snow.jpg')"});
                //fog, mist, haze etc
                if (id >= 701 && id <= 741)
                        $("body").css({"backgroundImage":"url('images/haze.jpg')"});
        }

        //function to create weather div
        function createWeatherDisplay() {
                $("body").append(weatherBoard);
        }
        //make this call from storage if called within refresh function by passing weather JSON in storage as parameter
        function displayWeatherInfo(JSON) {
                var icon = JSON.weather[0].id, hours, celcius = Math.round(JSON.main.temp), fahrenheit = Math.round((celcius * 9/5 + 32));
                //use value from storage as hours value if available, else generate new value
                storageAvailable ? hours = sessionStorage.hours : hours = new Date().getHours()
                //generate background
                chooseBackground(hours, JSON.weather[0].id);
                //write place name
                $(".place-text").html(JSON.name + ", " + JSON.sys.country);
                //write temp and change colour of text depending on temp
                $(".temp-text").html(celcius + "&#176;C" + "<br />");
                //write humidity
                $(".humidity-text").html("Humidity: " + JSON.main.humidity + "%");
                //write weather description
                $(".description-text").html(JSON.weather[0].description);
                //write icon depending on time
                $(".icon-text").html("<i id='iconic'></i>");
                (hours < 5 || hours > 18)? $("#iconic").addClass("wi wi-owm-night-" + icon) : $("#iconic").addClass("wi wi-owm-day-" + icon);

                //event handler for temp format change on switch click
                $("#toggle").on("click", function() {
                        $(".temp-text").toggleClass("fahrenheit");
                        $(".temp-text").hasClass("fahrenheit") ? $(".temp-text").html(fahrenheit + "&#176;F") : $(".temp-text").html(celcius + "&#176;C");
                });
        }

        function displayTime(time) {
                $(".time-text").html(time);
        }

        function refresh() {
                var date = new Date(), time = date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
                //only re-call weather if it has been over 15 mins since last call
                if (date.getTime() - sessionStorage.date > 900000) {
                        console.log("Checked weather");
                        //update date value in storage
                        sessionStorage.date = date;
                        //retrieve and display weather info
                        getWeather(sessionStorage.lat, sessionStorage.lon);
                        chooseBackground(date.getHours(), sessionStorage.id);
                }
                //change time regardless of how much time has passed
                displayTime(time);
        }

        /** MAIN PROGRAM **/

        //take actions if session storage available
        if (storageAvailable) {

                //get user's IP address
                $.getJSON("http://ip-api.com/json", function(data) {

                        //generate time info
                        getTime();

                        //store user's IP address
                        sessionStorage.lat = data.lat;
                        sessionStorage.lon = data.lon;
                });

                //clicking the weather button triggers the following events
                $("#getWeather").on("click", function() {

                        //clear screen of all elements
                        $("#content, #get-weather-div, #warning").remove();

                        //generate weather info
                        getWeather(sessionStorage.lat, sessionStorage.lon);

                        //display weather


                        //generate weather display
                        createWeatherDisplay();

                        //show time
                        displayTime(sessionStorage.time);

                        //provide functionality to refresh button
                        $(".fa").on("click", function() {
                                //function to rotate refresh icon
                                $(this).addClass("clicked");
                                setTimeout(function() {
                                        $(".fa").removeClass("clicked");
                                }, 1000);
                                refresh();
                        });
                });
        //take the following actions if session storage unavailable
        } else {
                //clicking the weather button triggers the following events
                $("#getWeather").on("click", function() {
                        //get user's IP address
                        $.getJSON("http://ip-api.com/json", function(data) {

                        //clear screen of all elements
                        $("#content, #get-weather-div, #warning").remove();

                        //generate weather info
                        getWeather(data.lat, data.lon);

                        //generate weather display
                        createWeatherDisplay();

                        //remove refresh button, as cannot use session storage
                        $(".refresh").remove();

                        //generate and display time info
                        displayTime(new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}));
                        });
                });
        }
});