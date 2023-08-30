

const WEATHER_API_KEY = "c02d3aabc48267d67543d02913e97701";
const searchButtonEl = document.querySelector(".btn-secondary");
const searchInputEl = document.querySelector("#formGroupExampleInput2");
const weatherContainerEl = document.querySelector(".current-weather-section");
const forecastContainerEl = document.querySelector(".future-weather-display");
const historyContainerEl = document.querySelector(".search-history");
const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

function createHistoryButton(cityName) {
  const historyButtonEl = document.createElement("button");
  historyButtonEl.classList.add("history-button", "btn", "btn-info");
  historyButtonEl.textContent = cityName;
  historyButtonEl.setAttribute("data-city", cityName);
  historyContainerEl.appendChild(historyButtonEl);
}

function fetchWeather(cityName) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${WEATHER_API_KEY}&units=imperial`;

  fetch(weatherUrl)
    .then(response => response.json())
    .then(weatherData => {
      renderWeather(weatherData);
      const { lat, lon } = weatherData.coord;
      fetchForecast(lat, lon);
    })
    .catch(error => {
      console.error(error);
    });
}

function fetchForecast(latitude, longitude) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=imperial`;

  fetch(forecastUrl)
    .then(response => response.json())
    .then(forecastData => {
      renderForecast(forecastData.list);
    })
    .catch(error => {
      console.error(error);
    });
}

function renderWeather(weatherData) {
    const card = document.createElement("div");
    card.setAttribute("class", "card");
    
    const cardHeader = document.createElement("div");
    cardHeader.setAttribute("class", "card-header");
    
    const h2 = document.createElement("h2");
    
    const icon = document.createElement("img");
    icon.setAttribute(
      "src",
      "https://openweathermap.org/img/w/" + weatherData.weather[0].icon + ".png"
    );
    
    const span = document.createElement("span");
    
    const cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");
    
    const temp = document.createElement("p");
    temp.textContent = `Temperature: ${weatherData.main.temp}`;
    
    const humidity = document.createElement("p");
    humidity.textContent = `Humidity: ${weatherData.main.humidity} %`;
    
    const wind = document.createElement("p");
    wind.textContent = `Wind Speed: ${weatherData.wind.speed} MPH`;
    
    h2.textContent = weatherData.name;
    span.append(icon);
    h2.append(span);
    cardHeader.append(h2);
    cardBody.append(temp, humidity, wind);
    card.append(cardHeader, cardBody);
    weatherContainerEl.innerHTML = ""; 
    weatherContainerEl.appendChild(card);
  }

  function renderForecast(forecastList) {
    const forecastContainer = document.querySelector(".future-weather-display");

    forecastContainer.innerHTML = "";

    for (let i = 0; i < 5; i++) {
        const forecastData = forecastList[i * 8 + 4];
        const card = document.createElement("div");
        card.setAttribute("class", "card");

        const cardHeader = document.createElement("div");
        cardHeader.setAttribute("class", "card-header");

        const h2 = document.createElement("h2");

        const icon = document.createElement("img");
        icon.setAttribute(
            "src",
            "https://openweathermap.org/img/w/" +
            forecastData.weather[0].icon +
            ".png"
        );

        const day = new Date(forecastData.dt * 1000);
        h2.textContent = day.toDateString();

        const span = document.createElement("span");

        const cardBody = document.createElement("div");
        cardBody.setAttribute("class", "card-body");

        const temp = document.createElement("p");
        temp.textContent = `Temperature: ${forecastData.main.temp} F`;

        const humidity = document.createElement("p");
        humidity.textContent = `Humidity: ${forecastData.main.humidity} %`;

        const wind = document.createElement("p");
        wind.textContent = `Wind Speed: ${forecastData.wind.speed} KPH`;

        span.append(icon);
        h2.append(span);
        cardHeader.append(h2);
        cardBody.append(temp, humidity, wind);
        card.append(cardHeader, cardBody);
        forecastContainer.appendChild(card); 
    }
}


function saveToHistory(cityName) {
  if (!searchHistory.includes(cityName)) {
    searchHistory.push(cityName);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    createHistoryButton(cityName);
  }
}

searchButtonEl.addEventListener("click", event => {
  event.preventDefault();
  const cityName = searchInputEl.value;
  fetchWeather(cityName);
  saveToHistory(cityName);
});

historyContainerEl.addEventListener("click", event => {
  const clickedButton = event.target.closest(".history-button");
  if (clickedButton) {
    const clickedCity = clickedButton.getAttribute("data-city");
    fetchWeather(clickedCity);
  }
});

// Initialize history buttons
searchHistory.forEach(city => {
  createHistoryButton(city);
});
