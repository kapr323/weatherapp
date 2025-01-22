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
  function updateSuggestions(suggestions, input) {
    const suggestionBox = document.querySelector('#suggestions');
    suggestionBox.innerHTML = '';
  
    const filteredCities = suggestions.filter(city =>
      city.name.toLowerCase().includes(input.toLowerCase())
    );
  
    filteredCities.forEach(city => {
      const li = document.createElement('li');
      li.textContent = city.name;
      li.addEventListener('click', () => {
        document.querySelector('#city-input').value = city.name;
        suggestionBox.innerHTML = '';
        updateWeather(city.name);
      });
      suggestionBox.appendChild(li);
    });
  }
  
  function updateWeather(city) {
    const selectedCity = document.querySelector('#selected-city');
    selectedCity.textContent = city;
    console.log(`Zobrazuji předpověď pro město: ${city}`);
  }
  
  async function initApp() {
    const cities = await loadCities();
    const cityInput = document.querySelector('#city-input');
  
    cityInput.addEventListener('input', () => {
      const inputValue = cityInput.value;
      if (inputValue.trim() !== '') {
        updateSuggestions(cities, inputValue);
      } else {
        document.querySelector('#suggestions').innerHTML = '';
      }
    });
  }
  
  initApp();
  