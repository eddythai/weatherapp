import {format} from 'date-fns'

async function getResponse(location){
        const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=d3f64c12569b403faca235609230205&q=${location}`)
        const data = await res.json()
        return data
}

function getLocation(data) {
   return data.location
}

function getWeather(data) {
    return {"text": data.current.condition.text, "icon": data.current.condition.icon}
}

function getTemp(data) {
    return {"temp_f": data.current.temp_f, "temp_c": data.current.temp_c}
}

async function createCard(location) {
    const cardElem = document.querySelector(".card")
    cardElem.replaceChildren()
    const data = await getResponse(location)
    console.log(data)

    cardElem.appendChild(createLocationElem(getLocation(data)))

    cardElem.appendChild(createTimeElem(getLocation(data)))

    const contentElem = document.createElement("div")
    contentElem.classList.add("content")
    contentElem.appendChild(createTempElem(getTemp(data)))
    contentElem.appendChild(createWeatherElem(getWeather(data)))
    cardElem.appendChild(contentElem)
    
}

function createLocationElem(locationData){
    const locationElem = document.createElement("div")
    locationElem.classList.add("location-container")

    if(locationData.country != "United States of America"){
        locationElem.innerHTML = `<input class="search-bar" id="location" name="location" value="${locationData.name}, ${locationData.country}">`
    } else {
        locationElem.innerHTML = `<input class="search-bar" id="location" name="location" value="${locationData.name}, ${locationData.region}">`
    }

    const searchElem = document.createElement("div")
    searchElem.innerHTML = `<ion-icon name="search-outline"></ion-icon>`

    locationElem.appendChild(searchElem)

    searchElem.addEventListener("click", e => {
        createCard(document.querySelector("#location").value)
    })

    locationElem.addEventListener("keydown", e => {
        if(e.key == "Enter") {
            searchElem.click()
        }
    })
    


    return locationElem
}

function createTimeElem(locationData) {
    const timeElem = document.createElement("div")
    timeElem.classList.add("time")
    
    const time = locationData.localtime.split(" ")
    if (time[1].length < 5){
        time[1] = "0"+time[1]
    }
    timeElem.innerText = `at ${format(new Date(time.join(" ")), "p iii, MMM d yyyy")}`
    return timeElem
}

function createTempElem(tempData) {
    const tempElem = document.createElement("div")
    tempElem.classList.add("temp-container")

    const tempNum = document.createElement("div")
    tempNum.classList.add("temp-num")
    tempNum.innerText = tempData.temp_f
    tempElem.appendChild(tempNum)

    const tempType = document.createElement("div")
    tempType.classList.add("temp-type")
    tempType.innerText = "°F"
    tempElem.appendChild(tempType)

    return tempElem
}

function createWeatherElem(weatherData){
    const weatherElem = document.createElement("div")
    weatherElem.classList.add("weather-container")

    const weatherIcon = document.createElement("img")
    weatherIcon.classList.add("weather-icon")
    weatherIcon.src = weatherData.icon
    weatherElem.appendChild(weatherIcon)
    const weatherText = document.createElement("div")
    weatherText.classList.add("weather-text")
    weatherText.innerText = weatherData.text
    weatherElem.appendChild(weatherText)

    return weatherElem

}


createCard("Los Angeles")
