const PRESELECTED_CITIES = ["Philadelphia", "Chicago", "Washington DC", "Los Angeles", "New York", "San Francisco", "Boston", "Miami"];

const searchForm = document.querySelector('.search-form');
const mainDisplay = document.getElementById("main-display");
const splashDisplay = document.getElementById("splash-display");

const onLoadCityData = async (cityName) => {
    splashDisplay.style.display = "block";
    document.querySelector(".splash-label").textContent = "LOADING...";
    mainDisplay.style.display = "none";

    let newCorridnates = null;
    let foundCityWeatherData = {
        mainCurrentWeather: '',
        mainCurrentTemp: '',
        mainCurrentMinTemp: '',
        mainCurrentMaxTemp: '',
        mainCurrentFeelsLike: '',
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

            let cityStateName = cityName + ", " + response[0].state;
            //set the date
            let weatherDateHeader = document.querySelector(".current-weather-date-header");
            let today = dayjs();
            let dateString = today.format('MM.DD.YYYY');
            let dayString = today.format('dddd');
            weatherDateHeader.textContent = "Current Weather For " + dayString + ", " + dateString;

            //get the current weather
            fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + newCorridnates.lat + '&lon=' + newCorridnates.lon + '&units=imperial&appid=' + API_KEY.id).then(response => response.json())
                .then(response => {

                    //get main current weather
                    let mainCurrentWeather = response.weather[0].main;
                    foundCityWeatherData.mainCurrentTemp = response.main.temp
                    foundCityWeatherData.mainCurrentMinTemp = response.main.temp_min;
                    foundCityWeatherData.mainCurrentMaxTemp = response.main.temp_max;
                    foundCityWeatherData.mainCurrentWind = response.wind.speed;
                    foundCityWeatherData.mainCurrentHumidity = response.main.humidity;
                    foundCityWeatherData.mainCurrentFeelsLike = response.main.feels_like;
                    console.log(response.weather[0]);
                    let mainIconUrl = "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
                    let mainIconImage = document.querySelector('#main-icon-image');
                    mainIconImage.src = mainIconUrl;
                    document.querySelector('#current-temp-lbl').textContent = "Temp: " + foundCityWeatherData.mainCurrentTemp + "\u00B0F"

                    document.querySelector('#current-wind-lbl').textContent = "Wind: " + foundCityWeatherData.mainCurrentWind + "MPH"

                    document.querySelector('#current-humidity-lbl').textContent = "Humidity: " + foundCityWeatherData.mainCurrentHumidity + "%";

                    document.querySelector('#current-minTemp-lbl').textContent = "Min Temp: " + foundCityWeatherData.mainCurrentMinTemp + "\u00B0F";

                    document.querySelector('#current-maxTemp-lbl').textContent = "Min Temp: " + foundCityWeatherData.mainCurrentMaxTemp + "\u00B0F";

                    document.querySelector('#current-feelslike-lbl').textContent = "Feels Like: " + foundCityWeatherData.mainCurrentFeelsLike + "\u00B0F";

                    document.querySelector(".main-current-weather-label").textContent = mainCurrentWeather;
                    //get the five day forecast
                    fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + newCorridnates.lat + '&lon=' + newCorridnates.lon + '&units=imperial&appid=' + API_KEY.id).then(response => response.json())
                        .then(response => {
                            //set the 5 day forecast data
                            //Date/Time Index Values
                            let foundDays = 0;
                            let forecastData = response.list;
                            for (let j = 0; j < forecastData.length; j++) {

                                //parse out values needed
                                let dayWeatherObj = forecastData[j];
                                let timeWeatherString = dayWeatherObj.dt_txt;
                                let parsedtimeWeatherStringArray = timeWeatherString.split(" ");
                                let forecastDate = parsedtimeWeatherStringArray[0];
                                let forecastTime = parsedtimeWeatherStringArray[1];

                                //set the date in the correct forecast tile and check the time of day to ensure noon forecast
                                if (forecastTime === '15:00:00') {
                                    //this is the correct forecast and needs to be captured into the tile
                                    //set the current day first
                                    let thisDay = dayjs(forecastDate);
                                    //find correct label
                                    console.log(dayWeatherObj);
                                    let dayLabelString = ('#day-' + foundDays + '-forecast-date');
                                    let dayLabel = document.querySelector('#day-' + foundDays + '-forecast-date');
                                    dayLabel.innerText = thisDay.format('dddd');

                                    let mainLbl = document.querySelector('#day-' + foundDays + '-forecast-main');
                                    mainLbl.innerText = dayWeatherObj.weather[0].description;

                                    let tempLbl = document.querySelector('#day-' + foundDays + '-forecast-temp');
                                    tempLbl.innerText = Math.round(dayWeatherObj.main.temp) + "\u00B0F";

                                    let windLbl = document.querySelector('#day-' + foundDays + '-forecast-wind');
                                    windLbl.innerText = "Wind: " + dayWeatherObj.wind.speed + "MPH";
                                    let humidLbl = document.querySelector('#day-' + foundDays + '-forecast-humidity');
                                    humidLbl.innerText = "Humidity: " + dayWeatherObj.main.humidity + "%";

                                    //set the icons
                                    //create icon url
                                    let iconUrl = "https://openweathermap.org/img/wn/" + dayWeatherObj.weather[0].icon + "@2x.png"
                                    //change the src attr of image icon 
                                    let weatherIcon = document.querySelector('#day-' + foundDays + '-forecast-image');
                                    weatherIcon.src = iconUrl;
                                    foundDays++;

                                }


                            }

                            //set the found weather day and city name into the page.
                            let cityNameHeader = document.querySelector('.current-weather-city-header');
                            cityNameHeader.textContent = cityStateName;

                            splashDisplay.style.display = "none";
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
    onLoadCityData(citySearch.value);
});
