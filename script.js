 
document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display weather data for Mumbai by default
    fetchWeatherData('Mumbai');
});

document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value.trim();
    if (city) {
        fetchWeatherData(city);
    } else {
        alert('Please enter a city name.');
    }
});

 document.getElementById('location-btn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherDataByCoordinates(lat, lon);
        }, (error) => {
            alert("Geolocation error: " + error.message);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

async function fetchWeatherData(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        if (!response.ok) throw new Error('City not found');

        const data = await response.json();
        displayCurrentWeather(data);

        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );
        if (!forecastResponse.ok) throw new Error('Unable to fetch forecast data');

        const forecastData = await forecastResponse.json();
        displayExtendedForecast(forecastData);
    } catch (error) {
        alert(error.message);
    }
}

 async function fetchWeatherDataByCoordinates(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        if (!response.ok) throw new Error('Unable to fetch weather data for current location');

        const data = await response.json();
        displayCurrentWeather(data);

        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        if (!forecastResponse.ok) throw new Error('Unable to fetch forecast data');

        const forecastData = await forecastResponse.json();
        displayExtendedForecast(forecastData);
    } catch (error) {
        alert(error.message);
    }
}

function displayCurrentWeather(data) {
    const { name, main, weather, wind } = data;
    document.getElementById('current-weather-data').innerHTML = `
        <div>
            <p><strong>City:</strong> ${name}</p>
            <p><strong>Temperature:</strong> ${main.temp}&deg;C</p>
            <p><strong>Condition:</strong> ${weather[0].description}</p>
            <p><strong>Humidity:</strong> ${main.humidity}%</p>
            <p><strong>Wind Speed:</strong> ${wind.speed} m/s</p>
        </div>
        <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="Weather Icon" class="w-16 h-16">
    `;
}

function displayExtendedForecast(data) {
    const forecastContainer = document.getElementById('forecast-data');
    forecastContainer.innerHTML = '';

    const dailyForecasts = data.list.filter((reading) => reading.dt_txt.includes('12:00:00'));

    dailyForecasts.forEach((forecast) => {
        const { dt_txt, main, weather, wind } = forecast;
        const date = new Date(dt_txt).toLocaleDateString();

        forecastContainer.innerHTML += `
            <div class="bg-gray-300 p-4 rounded shadow text-center">
                <p><strong>${date}</strong></p>
                <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="Weather Icon" class="mx-auto">
                <p>Temp: ${main.temp}&deg;C</p>
                <p>Wind: ${wind.speed} m/s</p>
                <p>Humidity: ${main.humidity}%</p>
            </div>
        `;
    });
}
 