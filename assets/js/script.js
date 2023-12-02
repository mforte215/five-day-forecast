const PRESELECTED_CITIES = ["Philadelphia", "Chicago", "Washington DC", "Los Angeles", "New York", "San Francisco", "Boston", "Miami"];

const searchForm = document.querySelector('.search-form');
const mainDisplay = document.getElementById("main-display");
const onLoadCityData = async (cityName) => {
    mainDisplay.style.display = "none";
    let newCorridnates = null;
    let foundCityWeatherData = {
        mainCurrentWeather: '',
        mainCurrentTemp: '',
        mainCurrentMinTemp: '',
        mainCurrentMaxTemp: '',
        mainCurrentWind: '',
        mainCurrentHumidity: '',
        fiveDayForecast: [{
            mainWeather: '',
            minTemp: '',
            maxTemp: '',
        },
        {
            mainWeather: '',
            minTemp: '',
            maxTemp: '',
        },
        {
            mainWeather: '',
            minTemp: '',
            maxTemp: '',
        },
        {
            mainWeather: '',
            minTemp: '',
            maxTemp: '',
        },
        {
            mainWeather: '',
            minTemp: '',
            maxTemp: '',
        }
        ]
    };
    //get the corrdinates
    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=' + API_KEY.id, {
        'method': 'GET'
    }).then(response => response.json())
        .then(response => {
            let foundLat = response[0].lat;
            let foundLon = response[0].lon;
            newCorridnates = {
                lat: foundLat,
                lon: foundLon,
            }
            console.log("LOGGING IN FIND BY NAME");
            console.log(newCorridnates);
            //get the current weather
            fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + newCorridnates.lat + '&lon=' + newCorridnates.lon + '&units=imperial&appid=' + API_KEY.id).then(response => response.json())
                .then(response => {
                    console.log("Logging WEATHER FOR " + cityName);

                    //get main current weather
                    let mainCurrentWeather = response.weather[0].main;
                    foundCityWeatherData.mainCurrentTemp = response.main.temp
                    foundCityWeatherData.mainCurrentMinTemp = response.main.temp_min;
                    foundCityWeatherData.mainCurrentMaxTemp = response.main.temp_max;
                    foundCityWeatherData.mainCurrentWind = response.wind.speed;
                    foundCityWeatherData.mainCurrentHumidity = response.main.humidity;

                    document.querySelector('#current-temp-lbl').textContent = "Temp: " + foundCityWeatherData.mainCurrentTemp + "\u00B0F"
                    document.querySelector('#current-wind-lbl').textContent = "Wind: " + foundCityWeatherData.mainCurrentWind + "MPH"
                    document.querySelector('#current-humidity-lbl').textContent = "Humidity: " + foundCityWeatherData.mainCurrentHumidity + "%";

                    console.log(response);
                    document.querySelector(".main-current-weather-label").textContent = mainCurrentWeather;
                    //get the five day forecast
                    fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + newCorridnates.lat + '&lon=' + newCorridnates.lon + '&units=imperial&appid=' + API_KEY.id).then(response => response.json())
                        .then(response => {
                            console.log("Logging 5 day forecast for " + cityName);
                            console.log(response);


                            //set the found weather day and city name into the page.
                            let cityNameHeader = document.querySelector('.current-weather-city-header');
                            cityNameHeader.textContent = cityName;


                            mainDisplay.style.display = "unset";

                        })


                })


        })

}

const setInitialData = () => {
    createPresetButtons();
}

const createPresetButtons = () => {
    //find the correct place to put them
    let newContainer = document.createElement("ul");
    newContainer.id = "preset-container"
    newContainer.classList.add("preset-container");
    searchForm.after(newContainer);


    for (let i = 0; i < PRESELECTED_CITIES.length; i++) {
        //get city
        let currentCity = PRESELECTED_CITIES[i];

        //create li
        let newPresetItem = document.createElement("li");
        newPresetItem.id = "preset-" + i;
        newPresetItem.classList.add("preset-item");
        newPresetItem.name = currentCity;
        newPresetItem.textContent = currentCity;
        newPresetItem.addEventListener("click", () => {
            onLoadCityData(currentCity);
        })
        //APPEND   
        newContainer.append(newPresetItem);

    }





}

setInitialData();



searchForm.addEventListener("submit", (event) => {
    //get input value 
    event.preventDefault();
    let citySearch = document.getElementById('city-name');
    console.log("Logging got input");
    console.log(citySearch.value);
    onLoadCityData(citySearch.value);
});
