// Temperature conversion functions
const celsiusToFahrenheit = (celsius) => (celsius * 9 / 5) + 32;
const celsiusToKelvin = (celsius) => celsius + 273.15;
const fahrenheitToCelsius = (fahrenheit) => (fahrenheit - 32) * 5 / 9;
const fahrenheitToKelvin = (fahrenheit) => (fahrenheit - 32) * 5 / 9 + 273.15;
const kelvinToCelsius = (kelvin) => kelvin - 273.15;
const kelvinToFahrenheit = (kelvin) => (kelvin - 273.15) * 9 / 5 + 32;

// DOM Elements
const celsiusInput = document.getElementById('celsius');
const fahrenheitInput = document.getElementById('fahrenheit');
const kelvinInput = document.getElementById('kelvin');
const convertBtn = document.getElementById('convertBtn');
const citySelect = document.getElementById('citySelect');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const weatherResult = document.getElementById('weatherResult');
const weatherInfo = document.getElementById('weatherInfo');
const cityCards = document.getElementById('cityCards');
const toggleViewBtn = document.getElementById('toggleViewBtn');
const weatherTable = document.getElementById('weatherTable');
const temperatureTableBody = document.getElementById('temperatureTableBody');
const temperatureChart = document.getElementById('temperatureChart');



const API_KEY = '4d8fb5b93d4af21d66a2948710284366';

// Store city temperatures
let cityTemperatures = {};
let selectedCity = '';

function createCityCard(city, temperature, difference = null) {
    const card = document.createElement('div');
    card.className = `city-card ${city === selectedCity ? 'selected' : ''}`;

    let differenceHTML = '';
    if (difference !== null) {
        const differenceClass = difference > 0 ? 'positive' : 'negative';
        differenceHTML = `
            <p class="temperature-difference ${differenceClass}">
                ${Math.abs(difference).toFixed(1)}°C ${difference > 0 ? 'warmer' : 'cooler'}
            </p>
        `;
    }

    let weatherIcon = '🌡️';
    if (temperature < 0) weatherIcon = '❄️';
    else if (temperature < 10) weatherIcon = '🌨️';
    else if (temperature < 20) weatherIcon = '🌤️';
    else if (temperature < 30) weatherIcon = '☀️';
    else weatherIcon = '🌡️';

    card.innerHTML = `
        <div style="font-size: 2.5rem; margin-bottom: 1rem;">${weatherIcon}</div>
        <h3>${city}</h3>
        <p class="temperature-info">${temperature.toFixed(1)}°C</p>
        <p class="temperature-info">${celsiusToFahrenheit(temperature).toFixed(1)}°F</p>
        <p class="temperature-info">${celsiusToKelvin(temperature).toFixed(1)}K</p>
        
    `;

    return card;
}

function updateTemperatureTable() {



    temperatureTableBody.innerHTML = '';

    const selectedTemp = cityTemperatures[selectedCity];

    Object.entries(cityTemperatures)
        .sort(([cityA, tempA], [cityB, tempB]) => {
            if (cityA === selectedCity) return -1;
            if (cityB === selectedCity) return 1;
            return tempA - tempB;
        })
        .forEach(([city, temp]) => {
            const difference = city === selectedCity ? 0 : temp - selectedTemp;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${city}</td>
                <td>${temp.toFixed(1)}°C</td>
                <td>${city === selectedCity ? '-' : difference.toFixed(1)}°C</td>
            `;
            if (city === selectedCity) {
                row.style.fontWeight = 'bold';
                row.style.backgroundColor = 'rgba(249, 222, 144, 0.1)';
            }
            temperatureTableBody.appendChild(row);
        });
}
function updateTemperatureChart() {
    const temperatureData = {
        labels: Object.keys(cityTemperatures),
        datasets: [{
            label: 'Temperature (°C)',
            data: Object.values(cityTemperatures),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false,
            tension: 0.1
        }]
    };

    const ctx = document.getElementById('temperatureChart').getContext('2d');
    const temperatureChart = new Chart(ctx, { 
        type: 'bar',
        data: temperatureData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Make the chart container visible
    document.getElementById('temperatureChartContainer').style.display = 'block';
}
async function updateWeatherDisplay() {
    cityCards.innerHTML = '';
    const cities = Array.from(citySelect.options)
        .map(option => option.value)
        .filter(city => city !== '');

    try {
        const weatherPromises = cities.map(city =>
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
                .then(response => response.json())
        );

        const weatherData = await Promise.all(weatherPromises);

        weatherData.forEach(data => {
            const city = data.name;
            const temperature = data.main.temp;
            cityTemperatures[city] = temperature;

            const difference = city === selectedCity ? null : temperature - cityTemperatures[selectedCity];
            const card = createCityCard(city, temperature, difference);
            cityCards.appendChild(card);
        });

        toggleViewBtn.classList.remove('hidden');
        updateTemperatureTable();
        updateTemperatureChart();

    } catch (error) {
        console.error('Weather API Error:', error);
        cityCards.innerHTML = `
            <p style="color: #d5cec0; text-align: center;">
                Error: Could not fetch weather data. Please try again later.<br>
                Details: ${error.message}
            </p>
        `;
    }
}

getWeatherBtn.addEventListener('click', async () => {
    selectedCity = citySelect.value;
    if (!selectedCity) {
        alert('Please select a city');
        return;
    }
    await updateWeatherDisplay();
});

toggleViewBtn.addEventListener('click', () => {
    if (weatherTable.classList.contains('hidden')) {
        weatherTable.classList.remove('hidden');
        cityCards.classList.add('hidden');
        toggleViewBtn.textContent = 'Show Cards View';
    } else {
        weatherTable.classList.add('hidden');
        cityCards.classList.remove('hidden');
        toggleViewBtn.textContent = 'Show Table View';
    }
});


convertBtn.addEventListener('click', () => {
    if (celsiusInput.value !== '') {
        const celsius = parseFloat(celsiusInput.value);
        updateAllTemperatures(celsius);
    } else if (fahrenheitInput.value !== '') {
        const fahrenheit = parseFloat(fahrenheitInput.value);
        const celsius = fahrenheitToCelsius(fahrenheit);
        updateAllTemperatures(celsius);
    } else if (kelvinInput.value !== '') {
        const kelvin = parseFloat(kelvinInput.value);
        const celsius = kelvinToCelsius(kelvin);
        updateAllTemperatures(celsius);
    }
});


const formatTemperature = (temp, unit) => `${temp.toFixed(2)}°${unit}`;


const updateAllTemperatures = (celsius) => {
    const fahrenheit = celsiusToFahrenheit(celsius);
    const kelvin = celsiusToKelvin(celsius);

    celsiusInput.value = celsius.toFixed(2);
    fahrenheitInput.value = fahrenheit.toFixed(2);
    kelvinInput.value = kelvin.toFixed(2);

    return {
        celsius: formatTemperature(celsius, 'C'),
        fahrenheit: formatTemperature(fahrenheit, 'F'),
        kelvin: formatTemperature(kelvin, 'K')
    };
};


[celsiusInput, fahrenheitInput, kelvinInput].forEach(input => {
    input.addEventListener('input', (e) => {
        const currentInput = e.target;
        [celsiusInput, fahrenheitInput, kelvinInput].forEach(input => {
            if (input !== currentInput) {
                input.value = '';
            }
        });
    });
});

function validateTemperature(input) {
    const value = parseFloat(input.value);
    if (input.id === 'kelvin' && value < 0) {
        alert('Kelvin cannot be negative!');
        input.value = '';
        return false;
    }
    return true;
}

[celsiusInput, fahrenheitInput, kelvinInput].forEach(input => {
    input.addEventListener('change', () => validateTemperature(input));
});

