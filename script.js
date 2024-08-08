const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

const updateUI = (isError, imageSrc = '') => {
    container.style.height = isError ? '400px' : '550px';
    weatherBox.classList.toggle('active', !isError);
    weatherDetails.classList.toggle('active', !isError);
    error404.classList.toggle('active', isError);
    
    const image = document.querySelector('.weather-box img');
    if (isError) {
        image.src = '404.png'; // Show 404 image if error
    } else {
        image.src = imageSrc; // Set image based on weather condition
    }
};

search.addEventListener('click', () => {
    const APIkey = '98740f4ebc0d63bc0f8ba70090e5a091';
    const city = document.querySelector('.search-box input').value;

    if (city === '') return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIkey}`)
        .then(response => response.json())
        .then(json => {
            if (json.cod === '404') {
                updateUI(true); // Show 404 image and message
                return;
            }

            updateUI(false, getWeatherImage(json.weather[0].main));

            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .info-humidity span');
            const wind = document.querySelector('.weather-details .info-wind span');

            if (!json.main || !json.weather[0] || !json.wind) {
                console.error('Invalid data received from API');
                return;
            }

            // Update weather details
            const temperatureValue = parseInt(json.main.temp);
            const descriptionValue = json.weather[0].description;
            const humidityValue = json.main.humidity;
            const windSpeedValue = parseInt(json.wind.speed);

            temperature.innerHTML = `${temperatureValue} <span>°C</span>`;
            description.innerHTML = descriptionValue;
            humidity.innerHTML = `${humidityValue}%`;
            wind.innerHTML = `${windSpeedValue} km/h`;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
});

const getWeatherImage = (weatherCondition) => {
    switch (weatherCondition) {
        case 'Clear':
            return 'clear.png';
        case 'Rain':
            return 'rain.png';
        case 'Snow':
            return 'snow.png';
        case 'Mist':
            return 'mist.png';
        default:
            return 'cloud.png'; // Default image
    }
};
