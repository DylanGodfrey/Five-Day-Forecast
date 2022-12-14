//Add event listener to search button
document.getElementById("searchBtn").addEventListener("click", handleInput);

//Add user inputted city to localstorage and fetch using it as part of the query string for the OpenWeatherAPI
function handleInput(){
    newCity = document.getElementById("searchInput").value;
    setHistory(newCity);
    getForecast(newCity);
}; 

//RENDER previous searches (if any) from localStorage
renderHistory();

//SET LocalStorage
function setHistory (newCityItem) {
    var historyList = getHistory();
    (historyList.includes(newCityItem)) ? null : historyList.push(newCityItem);
    localStorage.setItem("cityItem", JSON.stringify(historyList));
    //Render new history
    renderHistory();
};  

function renderHistory () {
    // clear old history and display updated historyList
    $(".history").empty();
    $(".history").addClass("h2 card-header text-uppercase text-center")
    $(".history").text("Search History");

    var historyList = getHistory();
    for (var i = 0; i < historyList.length; i++) {
        var cityListItem = $("<div>") 
        cityListItem.attr('id', historyList[i]) 
        cityListItem.text(historyList[i]) 
        cityListItem.addClass("h4 list-group-item text-uppercase text-center history-list")
        $(".history").append(cityListItem)
    }
};


//GET LocalStorage, add only if new item is unique to localStorage
function getHistory() {
    var history = localStorage.getItem("cityItem");
    (history  !== null) ? history = JSON.parse(history) : history = [];
    return history;
}

//Allow user to click a previous search to re-query the API with that search parameter
$(".history-list").on('click', function(event){
    event.preventDefault();
    $(".forecast-header").attr("style","display:inline");
     document.getElementById("searchInput").value =  event.target.id;
    getForecast(); 
});

function getForecast(){   
    // RESET the forecasts on call
    $(".five-day").empty();
    $(".today").empty();
      
    var countryCode = 'US';
    var cityCode = document.getElementById("searchInput").value.toUpperCase();
        
    var cityName =$("<h>") 
    cityName.addClass("h3")
    var temp = $("<div>")
    var wind = $("<div>")
    var humidity = $("<div>") 
    var icon =$("<img>")
    icon.addClass("icon");
    var dateTime = $("<div>")

    $(".today").addClass("list-group")
    $(".today").append(cityName)
    $(".today").append(dateTime)
    $(".today").append(icon)
    $(".today").append(temp)
    $(".today").append(wind)
    $(".today").append(humidity)
    
    var apiKey = '7d1b285353ccacd5326159e04cfab063';
    //URL to fetch an object that contains the lat and lon of queried city
    var geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityCode},${countryCode}&limit=5&appid=${apiKey}`;
        
      fetch(geoUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          geoLon = data[0].lon;
          geoLat = data[0].lat;

          //URL to fetch current weather of queried city
          var weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${geoLat}&lon=${geoLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`;
            
          fetch(weatherUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
            
            weatherIcon= data.current.weather[0].icon;
            icon.attr('src',`https://openweathermap.org/img/wn/${weatherIcon}.png`);
        
            cityName.text(cityCode.toUpperCase());
            //Translate UTC to date
            var date = new Date(data.current.dt * 1000);
            dateTime.text("("+ (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear() + ")");

            temp.text(`Temperature: ${data.current.temp} F`);
            humidity.text(`Humidity: ${data.current.humidity} %`);
            wind.text(`Wind Speed: ${data.current.wind_speed} MPH`);

            for (var i=0;i<5;i++){
                var forecastContainer = $("<div>")
                this["futureDate"+i] = $("<h>")
                this["futureIcon"+i] = $("<img>")
                this["futureTemp"+i] = $("<div>")
                this["futureWind"+i] = $("<div>")
                this["futureHumidity"+i] = $("<div>")
                //Translate UTC to date
                this["forecastDay"+i] = new Date(data.daily[i].dt * 1000);     
     
                (this["futureDate"+i]).text(`${((this["forecastDay"+i]).getMonth()+1)}/${(this["forecastDay"+i]).getDate()}/${(this["forecastDay"+i]).getFullYear()}`);
                (this["futureTemp"+i]).text(`Temperature: ${data.daily[i].temp.day} F`);
                (this["futureWind"+i]).text(`Wind: ${data.daily[i].wind_speed} MPH`);
                (this["futureHumidity"+i]).text(`Humidity: ${data.daily[i].humidity} %`);
                (this["weatherIcon"+i]) = data.daily[i].weather[0].icon;
        
                DateimgSrc = `https://openweathermap.org/img/wn/${(this["weatherIcon"+i])}.png`;  
                (this["futureIcon"+i]).attr('src',DateimgSrc)

                $(".five-day").append(forecastContainer)
                forecastContainer.append((this["futureDate"+i]));
                forecastContainer.append((this["futureIcon"+i]));
                forecastContainer.append((this["futureTemp"+i]));
                forecastContainer.append((this["futureWind"+i]));
                forecastContainer.append((this["futureHumidity"+i]));

                forecastContainer.addClass("weather-card")
            }
          })
    })
}
