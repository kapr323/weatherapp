let cities = [];

// JSON fetch
async function loadCities() {
  try {
    const response = await fetch('data/cities.json');
    if (!response.ok) {
      throw new Error('Chyba při načítání dat');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Našeptávač
function updateSuggestions(inputValue) {
  const suggestionBox = document.querySelector('#suggestions');
  suggestionBox.innerHTML = '';

  if (inputValue.trim() === '') return; // Pokud je vstup prázdný, nic nezobrazujeme

  const filteredCities = cities
    .filter(city => city.name.toLowerCase().includes(inputValue.toLowerCase()))
    .slice(0, 10); // Omezení na 10 návrhů

  filteredCities.forEach(city => {
    const li = document.createElement('li');
    li.textContent = `${city.name}, ${city.country}`;
    li.addEventListener('click', () => {
      document.querySelector('#city-input').value = city.name;
      suggestionBox.innerHTML = '';
      updateWeather(city);
    });
    suggestionBox.appendChild(li);
  });
}

function updateWeather(city) {
  const selectedCity = document.querySelector('#selected-city');
  selectedCity.textContent = `${city.name}, ${city.country}`;
  console.log('Calling fetchWeather for city:', city.name); // Debug
  fetchWeather(city.name);
}

// Načtení počasí z Weather API
async function fetchWeather(city) {
  const apiKey = '6b9153f356275edee69a5fb717fab446';
  const endpoint = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  console.log('API Endpoint:', endpoint); // Debug

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error('Chyba při načítání dat o počasí.');
    }
    const data = await response.json();
    updateForecast(data);
  } catch (error) {
    console.error('Chyba:', error);
  }
}

function updateForecast(data) {
  const forecastTable = document.querySelector('#forecast-table tbody');
  forecastTable.innerHTML = '';

  data.list.slice(0, 5).forEach(forecast => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${new Date(forecast.dt * 1000).toLocaleDateString()}</td>
      <td>${forecast.main.temp} °C</td>
      <td>${forecast.weather[0].description}</td>
    `;
    forecastTable.appendChild(row);
  });
}

async function initApp() {
  cities = await loadCities();
  const cityInput = document.querySelector('#city-input');

  cityInput.addEventListener('input', () => {
    const inputValue = cityInput.value;
    console.log('Input changed:', inputValue); // Debug
    updateSuggestions(cityInput.value);
  });
}

initApp();
