const PRESELECTED_CITIES = ["Philadelphia", "Chicago", "Washington DC", "Los Angeles", "New York", "San Francisco", "Seattle", "Miami", "Dallas", "Houston", "Phoenix"];



const findLatAndLonByName = async (cityName) => {
    let newCorridnates = null;

    fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=' + API_KEY.id, {
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
            fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + newCorridnates.lat + '&lon=' + newCorridnates.lon + '&units=imperial&appid=' + API_KEY.id).then(response => response.json())
                .then(response => {
                    console.log("Logging WEATHER FOR " + cityName);
                    console.log(response.main);
                })


        })

}

const onLoadCityData = async (cityName) => {
    let corrdinates = await findLatAndLonByName(cityName);
    console.log("LOGGING LOCATION IN ON LOAD");
    console.log(corrdinates);
}

const setInitialData = () => {
    createPresetButtons();
}

const createPresetButtons = () => {
    //find the correct place to put them
    const searchForm = document.querySelector('.search-form');
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




