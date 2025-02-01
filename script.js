let isCelsius = true; // Default unit is Celsius

// Automatically detect user's location when the app loads
window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherByCoords(lat, lon);
      },
      (error) => {
        console.error("Error getting location:", error);
        displayError("Unable to retrieve your location.");
      }
    );
  } else {
    displayError("Geolocation is not supported by your browser.");
  }
});

// Fetch weather data using latitude and longitude
function getWeatherByCoords(lat, lon) {
  const apiKey = "790d909d32eec16fabe0328dd3c0f079"; // Replace with your API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Unable to fetch weather data.");
      }
      return response.json();
    })
    .then((data) => {
      displayWeather(data);
    })
    .catch((error) => {
      displayError(error.message);
    });
}

// Add event listener for the unit toggle button
document.getElementById("unitToggle").addEventListener("click", () => {
  isCelsius = !isCelsius; // Toggle between Celsius and Fahrenheit
  const city = document.getElementById("cityInput").value;
  if (city) {
    getWeather(city); // Fetch weather data again to update the display
  }
  updateToggleButtonText();
});

// Update the toggle button text
function updateToggleButtonText() {
  const unitToggleButton = document.getElementById("unitToggle");
  unitToggleButton.textContent = isCelsius
    ? "Switch to Fahrenheit"
    : "Switch to Celsius";
}

// Fetch weather data by city name
document
  .getElementById("weatherForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const city = document.getElementById("cityInput").value;
    getWeather(city);
  });

function getWeather(city) {
  const apiKey = "790d909d32eec16fabe0328dd3c0f079"; // Replace with your API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then((data) => {
      displayWeather(data);
    })
    .catch((error) => {
      displayError(error.message);
    });
}

// Display weather data
function displayWeather(data) {
  const weatherDisplay = document.getElementById("weatherDisplay");
  const temp = isCelsius ? data.main.temp : (data.main.temp * 9) / 5 + 32; // Convert to Fahrenheit if needed
  const unit = isCelsius ? "°C" : "°F";

  weatherDisplay.innerHTML = `
    <div class="weather-info">
      <h2>${data.name}</h2>
      <p>Temperature: ${temp.toFixed(2)}${unit}</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Condition: ${data.weather[0].description}</p>
      <img class="weather-icon" src="http://openweathermap.org/img/wn/${
        data.weather[0].icon
      }@2x.png" alt="${data.weather[0].description}">
    </div>
  `;
}

// Display error message
function displayError(message) {
  const weatherDisplay = document.getElementById("weatherDisplay");
  weatherDisplay.innerHTML = `<p class="error">${message}</p>`;
}
