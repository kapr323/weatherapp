class WeatherApp {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.cities = [];
    this.forecastTable = document.querySelector('#forecast-table');
    this.userTimezoneOffset = new Date().getTimezoneOffset() * -1;
    this.userTimezoneAbbreviation = new Date()
      .toLocaleTimeString('en-us', { timeZoneName: 'short' })
      .split(' ')[2];
  }

  // Načtení JSON souboru s městy
  async loadCities() {
    try {
      const response = await fetch('data/cities.json');
      if (!response.ok) {
        throw new Error('Error loading');
      }
      this.cities = await response.json();
      console.log('Cities loaded:', this.cities.length);
    } catch (error) {
      console.error('Error loading JSON:', error);
      this.cities = [];
    }
  }

  // Vytvoření záhlaví tabulky
  initializeTableHeader() {
    this.forecastTable.innerHTML = `
      <thead>
        <tr>
          <th>Datum</th>
          <th>Min / Max</th>
          ${[0, 6, 12, 18].map(
            time => `<th>${time}:00 ${this.userTimezoneAbbreviation}</th>`
          ).join('')}
        </tr>
      </thead>
      <tbody></tbody>
    `;
  }

  // Našeptávač
  updateSuggestions(inputValue) {
    const suggestionBox = document.querySelector('#suggestions');
    suggestionBox.innerHTML = '';

    if (inputValue.trim() === '') return;

    const filteredCities = this.cities
      .filter(city => city.name.toLowerCase().includes(inputValue.toLowerCase()))
      .slice(0, 10);

    filteredCities.forEach(city => {
      const li = document.createElement('li');
      li.textContent = `${city.name}, ${city.country}`;
      li.addEventListener('click', () => {
        document.querySelector('#city-input').value = city.name;
        suggestionBox.innerHTML = '';
        this.updateWeather(city);
      });
      suggestionBox.appendChild(li);
    });
  }

  // Aktualizace počasí
  async updateWeather(city) {
    const selectedCity = document.querySelector('#selected-city');
    selectedCity.textContent = `${city.name}, ${city.country}`;
    console.log('Calling fetchWeather for city:', city.name);
    await this.fetchWeather(city.name);
  }

  // Fetch počasí z Weather API
  async fetchWeather(cityName) {
    const endpoint = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${this.apiKey}&units=metric`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Error fetching weather data');
      }
      const data = await response.json();
      this.updateForecast(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Aktualizace tabulky předpovědi
  updateForecast(data) {
    const days = this.groupForecastData(data.list);
    this.populateForecastTable(days);
  }

  // Seskupení předpovědí podle dnů
  groupForecastData(list) {
    const days = new Map();

    list.forEach(forecast => {
      const utcDate = new Date(forecast.dt * 1000);
      const localDate = new Date(
        utcDate.getTime() + this.userTimezoneOffset * 60 * 1000
      );
      const date = localDate.toLocaleDateString();
      const time = localDate.getHours();

      if (!days.has(date)) {
        days.set(date, {
          minTemp: Infinity,
          maxTemp: -Infinity,
          times: { 0: null, 6: null, 12: null, 18: null }
        });
      }

      const dayData = days.get(date);
      dayData.minTemp = Math.min(dayData.minTemp, forecast.main.temp);
      dayData.maxTemp = Math.max(dayData.maxTemp, forecast.main.temp);

      const closestTime = [0, 6, 12, 18].reduce((prev, curr) =>
        Math.abs(curr - time) < Math.abs(prev - time) ? curr : prev
      );

      if (!dayData.times[closestTime]) {
        dayData.times[closestTime] = {
          temp: forecast.main.temp.toFixed(1),
          icon: forecast.weather[0].icon
        };
      }
    });

    return days;
  }

  // Naplnění tabulky daty
  populateForecastTable(days) {
    const tbody = this.forecastTable.querySelector('tbody');
    tbody.innerHTML = '';

    days.forEach((dayData, date) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${date}</td>
        <td>Min: ${dayData.minTemp.toFixed(1)} °C / Max: ${dayData.maxTemp.toFixed(1)} °C</td>
        ${[0, 6, 12, 18].map(time => {
          const weather = dayData.times[time];
          if (weather) {
            return `
              <td>
                ${weather.temp} °C<br>
                <img src="https://openweathermap.org/img/wn/${weather.icon}.png" alt="Weather icon" title="${weather.temp} °C">
              </td>
            `;
          } else {
            return '<td>--</td>';
          }
        }).join('')}
      `;
      tbody.appendChild(row);
    });
  }

  // Inicializace aplikace
  async init() {
    this.initializeTableHeader();
    await this.loadCities();

    const cityInput = document.querySelector('#city-input');
    cityInput.addEventListener('input', () => {
      const inputValue = cityInput.value.trim();
      this.updateSuggestions(inputValue);
    });
  }
}

// Vytvoření instance aplikace
const app = new WeatherApp('6b9153f356275edee69a5fb717fab446');
app.init();
