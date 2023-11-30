const PRESELECTED_CITIES = ["Philadelphia", "Chicago", "Washington DC", "Los Angeles", "New York", "San Francisco", "Seattle", "Miami", "Dallas", "Houston", "Phoenix"];


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

        //APPEND   
        newContainer.append(newPresetItem);
    }


    const onLoadCityData = (cityName) => {

    }


}

setInitialData();




