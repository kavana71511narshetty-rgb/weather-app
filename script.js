
const API_KEY = "YOUR_API_KEY_HERE";

const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const message = document.getElementById("message");
const weatherResult = document.getElementById("weatherResult");

async function getWeather() {
    const city = cityInput.value.trim();

    if (city === "") {
        message.textContent = "Please enter a city name.";
        message.className = "error";
        weatherResult.replaceChildren();
        return;
    }

    message.textContent = "Loading weather information...";
    message.className = "";
    weatherResult.replaceChildren();

    try {
        const url =
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found. Please check the spelling.");
            }
            if (response.status === 401) {
                throw new Error("API key invalid or not active yet.");
            }
            throw new Error("Unable to retrieve weather information.");
        }

        const data = await response.json();
        displayWeather(data);
        message.textContent = "";

    } catch (error) {
        message.textContent = error.message;
        message.className = "error";
    }
}

function displayWeather(data) {
    const card = document.createElement("div");
    card.className = "weather-card";

    const heading = document.createElement("h2");
    heading.textContent = `${data.name}, ${data.sys.country}`;

    const icon = document.createElement("img");
    icon.className = "weather-icon";
    icon.alt = data.weather[0].description;
    icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    const temperature = document.createElement("p");
    temperature.className = "temperature";
    temperature.textContent = `${Math.round(data.main.temp)}°C`;

    const description = document.createElement("p");
    description.textContent = data.weather[0].description;

    const details = document.createElement("div");
    details.className = "details";

    const humidity = document.createElement("p");
    humidity.className = "detail";
    humidity.textContent = `Humidity: ${data.main.humidity}%`;

    const wind = document.createElement("p");
    wind.className = "detail";
    wind.textContent = `Wind: ${data.wind.speed} m/s`;

    details.append(humidity, wind);
    card.append(heading, icon, temperature, description, details);
    weatherResult.replaceChildren(card);
}

searchButton.addEventListener("click", getWeather);

cityInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        getWeather();
    }
});
