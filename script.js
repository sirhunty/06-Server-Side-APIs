const APIKEY = "ce0409395dee9ab9aa9cab9f0bb10142";
searchHistory();

// Initial city user search of Today's and the weekly weather 
// data
$("#citySearchBtn").on("click", function(event) {
  event.preventDefault();
  let citySearched = $("#citySearchText").val();
  $("#citySearchText").val("");
  getCurrentWeatherConditions(citySearched);
  getWeeklyForecast(citySearched);
});

// Taking the previous user city choice and putting the in the
// historical list
function searchHistory() {
    $("#searchHistoryList").empty();
    let searchHistory = getStoredWeatherData().searchHistory;
    if (searchHistory) {
      for (let i = 0; i < searchHistory.length; i++) {
        let item = $("<li class='list-group-item'></li>");
        item.text(searchHistory[i].cityName);
        $("#searchHistoryList").prepend(item);
      }
      $(".list-group-item").on("click", function() {
        getCurrentWeatherConditions($(this).text());
        getWeeklyForecast($(this).text());
        console.log(searchHistory); //testing searchHistory
      });
    }
  }
// Populates the user's last searches or returns empy if no data
function getStoredWeatherData() {
  let storedWeatherData = JSON.parse(localStorage.getItem("storedWeatherData"));
  if (!storedWeatherData) {
    return {
      searchHistory: [],
      data: {
        currentWeather: [],
        forecast: []
      }
    };
  } else {
    return storedWeatherData;

  }
}

// Check local storage for the weather data the user searched for
function getCurrentWeatherConditions(citySearched) {
  let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${citySearched}&units=imperial&appid=${APIKEY}`;
  let storedWeatherData = getStoredWeatherData();
  let searchHistory = storedWeatherData.searchHistory;
  let timeNow = new Date().getTime();
  citySearched = citySearched.toLowerCase().trim();
  for (let i = 0; i < searchHistory.length; i++) {
    if (
      searchHistory[i].cityName.toLowerCase() == citySearched &&
      timeNow < searchHistory[i].dt * 1000 + 600000
    ) {
      for (let j = 0; j < storedWeatherData.data.currentWeather.length; j++) {
        if (
          storedWeatherData.data.currentWeather[j].name.toLowerCase() ==
          citySearched
        ) {
          populateCurrentWeatherConditions(
            storedWeatherData.data.currentWeather[j]
          );
          return;
        }
      }
    }
  }

  // API call to get current weather if not in the local storage
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(results) {
    populateCurrentWeatherConditions(results);
    storeCurrentWeather(results);
    console.log(results);
  });
}

// Stores the current weather data from the API call.
function storeCurrentWeather(results) {
  let storedWeatherData = getStoredWeatherData();
  let searchHistoryEntry = {
    cityName: results.name,
    dt: results.dt
  };
  storedWeatherData.searchHistory.push(searchHistoryEntry);
  storedWeatherData.data.currentWeather.push(results);
  localStorage.setItem("storedWeatherData", JSON.stringify(storedWeatherData));
}

// Retrival of the current weather data from storage or the API call
function populateCurrentWeatherConditions(results) {
  let cityName = results.name;
  let date = new Date(results.dt * 1000);
  let description = results.weather[0].main;
  let humidity = results.main.humidity;
  let iconURL = `https://openweathermap.org/img/w/${results.weather[0].icon}.png`;
  let temp = results.main.temp;
  let windSpeed = results.wind.speed;
  let lon = results.coord.lon;
  let lat = results.coord.lat;

// Adds data to the html/page
  $("#currentCity").text(cityName);
  $("#todaysDate").text(
    `(${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()})`
  );
  $("#currentWeatherIcon").attr("src", iconURL);
  $("#currentWeatherIcon").attr("alt", description + " icon");
  $("#todaysTemp").text(temp);
  $("#todaysHumidity").text(humidity);
  $("#todaysWindSpeed").text(windSpeed);

  populateUVIndex(lon, lat);
}


