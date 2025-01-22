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
    console.log(`Zobrazuji předpověď pro město: ${city.name}, ${city.country}`);
  }
  
  async function initApp() {
    cities = await loadCities();
    const cityInput = document.querySelector('#city-input');
  
    cityInput.addEventListener('input', () => {
      const inputValue = cityInput.value;
        updateSuggestions(cityInput.value);
    });
  }
  
  initApp();
  