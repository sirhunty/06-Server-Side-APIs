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




