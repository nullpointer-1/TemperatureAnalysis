let frontSideTemperature = null;

const cities = [
    "Ahmedabad", "Bengaluru", "Chennai", "Delhi", "Hyderabad",
    "Jaipur", "Kolkata", "Lucknow", "Mumbai", "Pune"
];

const API_KEY = 'fb39181e16c248a3b8ae84b1f8dbe617';

// Function to Convert Temperature
function tempConvert() {
    let cel = document.getElementById("t_c");
    let far = document.getElementById("t_f");
    let kel = document.getElementById("t_k");

    if (!cel || !far || !kel) {
        alert("Temperature input fields not found!");
        return;
    }

    let celsius = parseFloat(cel.value);
    let fahrenheit = parseFloat(far.value);
    let kelvin = parseFloat(kel.value);
    if(celsius<=-61||celsius>=54){
        alert("Your Exceding the Indian Temperature Range.Please Provide a temperature between -60°C and 53°C");
        return;
    }

    if (!isNaN(celsius)) {
        fahrenheit = (celsius * 9 / 5) + 32;
        kelvin = celsius + 273.15;
    } else if (!isNaN(fahrenheit)) {
        celsius = (fahrenheit - 32) * 5 / 9;
        kelvin = celsius + 273.15;
    } else if (!isNaN(kelvin)) {
        celsius = kelvin - 273.15;
        fahrenheit = (celsius * 9 / 5) + 32;
    } else {
        alert("Please enter a valid temperature value.");
        return;
    }

    cel.value = celsius.toFixed(2);
    far.value = fahrenheit.toFixed(2);
    kel.value = kelvin.toFixed(2);

    frontSideTemperature = celsius;

    updateThermometer(celsius);
}

// Function to Update Thermometer UI
function updateThermometer(tempC) {
    let fillElement = document.getElementById("thermometer-fill");
    let labelElement = document.getElementById("thermometer-label");

    if (!fillElement || !labelElement) {
        console.error("Thermometer elements not found.");
        return;
    }

    let minTemp = -60, maxTemp = 53;
    let percent = ((tempC - minTemp) / (maxTemp - minTemp)) * 100;
    percent = Math.max(0, Math.min(100, percent));

    fillElement.style.height = percent + "%";

    if (tempC <= 0) {
        fillElement.style.background = "#00BFFF"; // Cold (Blue)
    } else if (tempC > 0 && tempC <= 20) {
        fillElement.style.background = "#87CEFA"; // Cool (Light Blue)
    } else if (tempC > 20 && tempC <= 35) {
        fillElement.style.background = "#FFA500"; // Warm (Orange)
    } else {
        fillElement.style.background = "#FF4500"; // Hot (Red)
    }

    labelElement.innerText = tempC.toFixed(2) + "°C";
}

// Function to Flip the Card
function flipCard() {
    const flipper = document.querySelector('.flipper');
    flipper.classList.toggle('flip');
}

// Function to Fetch Real-Time Weather Data for All Cities
async function fetchAllCitiesWeather() {
    const weatherData = [];

    for (const city of cities) {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );
            if (!response.ok) {
                throw new Error(`Failed to fetch data for ${city}`);
            }
            const data = await response.json();
            weatherData.push(data);
        } catch (error) {
            console.error(`Error fetching data for ${city}:`, error);
        }
    }

    return weatherData;
}

// Function to Get Weather Data and Display All City Cards
async function getCityWeather() {
    const selectedCity = document.getElementById('city').value;
    const weatherOutput = document.getElementById('weather-output');

    if (!selectedCity || frontSideTemperature === null || isNaN(frontSideTemperature)) {
        alert("Please select a city and enter a valid temperature in Celsius on the front side.");
        weatherOutput.classList.remove('visible'); 
        return;
    }

    const weatherData = await fetchAllCitiesWeather();

    console.log("Weather Data:", weatherData);

    const selectedCityData = weatherData.find(city => 
        city.name.toLowerCase() === selectedCity.toLowerCase()
    );

    if (!selectedCityData) {
        alert("Selected city data not found. Please try again.");
        weatherOutput.classList.remove('visible'); 
        return;
    }

    const selectedCityRealTemp = selectedCityData.main.temp;

    //temperature difference
    const tempDifference = frontSideTemperature - selectedCityRealTemp;

    // Display all city cards with adjusted temperatures
    displayAllCityCards(weatherData, selectedCity, tempDifference);
}

// Function to Display All City Cards
function displayAllCityCards(weatherData, selectedCity, tempDifference) {
    const weatherOutput = document.getElementById('weather-output');
    let weatherCardsHTML = '<div class="city-cards-container">'; // Flex container

    for (const cityData of weatherData) {
        const cityName = cityData.name;
        const realTemp = cityData.main.temp;
        const adjustedTemp = realTemp + tempDifference;

        weatherCardsHTML += `
            <div class="city-card">
                <h2>${cityName}</h2>
                <p><strong>Temperature:</strong> ${adjustedTemp.toFixed(2)}°C</p>
                <p><strong>Weather:</strong> ${cityData.weather[0].description}</p>
                <p><strong>Humidity:</strong> ${cityData.main.humidity}%</p>
                <p><strong>Wind Speed:</strong> ${cityData.wind.speed} m/s</p>
            </div>
        `;
    }

    weatherCardsHTML += '</div>'; // Close flex container
    weatherOutput.innerHTML = weatherCardsHTML;
    weatherOutput.classList.add('visible');
}