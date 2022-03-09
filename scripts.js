var allCities = [];

var cityFormEl=document.querySelector("#citySearchForm");
var theCityInputEl=document.querySelector("#city");
var presentWeatherContainerEl=document.querySelector("#presentWeatherContainer");
var cityFinderInputEl = document.querySelector("#searchedCity");
var theForecastTitle = document.querySelector("#forecast");
var TheForecastContainerEl = document.querySelector("#fivedayContainer");
var oldCitySearchButtonEl = document.querySelector("#oldSearchButtons");


var formSumbitHandler = function(event){
    event.preventDefault();
    var city = theCityInputEl.value.trim();
    if(city){
        getCityWeather(city);
        get5Day(city);
        allCities.unshift({city});
        theCityInputEl.value = "";
    } else{
        alert("Please enter a City:");
    }
    savedSearch();
    oldSearch(city);
}

var savedSearch = function(){
    localStorage.setItem("allCities", JSON.stringify(allCities));
};

var getCityWeather = function(city){
    var apiKey = "cc08f794994e892d499e3af0e915b375"
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            showWeather(data, city);
        });
    });
};

var showWeather = function(weather, searchCity){
    
    presentWeatherContainerEl.textContent= "";  
    cityFinderInputEl.textContent=searchCity;
 

 

    var todayDate = document.createElement("span")
    todayDate.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
    cityFinderInputEl.appendChild(todayDate);
 

    var weatherImg = document.createElement("img")
    weatherImg.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    cityFinderInputEl.appendChild(weatherImg);
 

    var tempEl = document.createElement("span");
    tempEl.textContent = "Temperature: " + weather.main.temp + " °F";
    tempEl.classList = "list-group-item"

    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    humidityEl.classList = "list-group-item"
 

    var windSpeedEl = document.createElement("span");
    windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    windSpeedEl.classList = "list-group-item"
 

    presentWeatherContainerEl.appendChild(tempEl);

    presentWeatherContainerEl.appendChild(humidityEl);

    presentWeatherContainerEl.appendChild(windSpeedEl);
 
    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    getUvIndex(lat,lon)
 }

 var getUvIndex = function(lat,lon){
    var apiKey = "cc08f794994e892d499e3af0e915b375"
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayUvIndex(data)
           
        });
    });
   
}
 
var displayUvIndex = function(index){
    var UVIndexEl = document.createElement("div");
    UVIndexEl.textContent = "UV Index: "
    UVIndexEl.classList = "list-group-item"

    UVIndexValue = document.createElement("span")
    UVIndexValue.textContent = index.value

    if(index.value <=2){
        UVIndexValue.classList = "favorable"
    }else if(index.value >2 && index.value<=8){
        UVIndexValue.classList = "moderate "
    }
    else if(index.value >8){
        UVIndexValue.classList = "severe"
    };

    UVIndexEl.appendChild(UVIndexValue);

    //append index to current weather
    presentWeatherContainerEl.appendChild(UVIndexEl);
}

var get5Day = function(city){
    var apiKey = "cc08f794994e892d499e3af0e915b375"
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           display5Day(data);
        });
    });
};

var display5Day = function(weather){
    TheForecastContainerEl.textContent = ""
    theForecastTitle.textContent = "5-Day Forecast:";

    var forecast = weather.list;
        for(var i=5; i < forecast.length; i=i+8){
       var dailyForecast = forecast[i];
        
       
       var forecastEl=document.createElement("div");
       forecastEl.classList = "card bg-primary text-light m-2";

       //console.log(dailyForecast)

       //create date element
       var forecastDate = document.createElement("h5")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
       forecastDate.classList = "card-header text-center"
       forecastEl.appendChild(forecastDate);

       
       //create an image element
       var weatherImg = document.createElement("img")
       weatherImg.classList = "card-body text-center";
       weatherImg.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  

       //append to forecast card
       forecastEl.appendChild(weatherImg);
       
       //create temperature span
       var forecastTempEl=document.createElement("span");
       forecastTempEl.classList = "card-body text-center";
       forecastTempEl.textContent = dailyForecast.main.temp + " °F";

        //append to forecast card
        forecastEl.appendChild(forecastTempEl);

       var forecastHumEl=document.createElement("span");
       forecastHumEl.classList = "card-body text-center";
       forecastHumEl.textContent = dailyForecast.main.humidity + "  %";

       //append to forecast card
       forecastEl.appendChild(forecastHumEl);

        // console.log(forecastEl);
       //append to five day container
        TheForecastContainerEl.appendChild(forecastEl);
    }

}

var oldSearch = function(oldSearch){
 
    // console.log(oldSearch)

    oldSearchEl = document.createElement("button");
    oldSearchEl.textContent = oldSearch;
    oldSearchEl.classList = "d-flex w-100 btn-light border p-2";
    oldSearchEl.setAttribute("data-city",oldSearch)
    oldSearchEl.setAttribute("type", "submit");

    oldCitySearchButtonEl.prepend(oldSearchEl);
}


var oldSearchHandler = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        getCityWeather(city);
        get5Day(city);
    }
}




cityFormEl.addEventListener("submit", formSumbitHandler);
oldCitySearchButtonEl.addEventListener("click", oldSearchHandler);