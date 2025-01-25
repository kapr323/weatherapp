# Weatherapp
An easy web app for weather forecast for next 5 days.
User can select a city using an autocomplete feature and view the forecast fetched from the OpenWeatherMap API.

## Requirements
- Modern browser (Chrome, Chromium, Firefox, Edge)
- IDE with Live server or any local server to run the app

## How to Run the Project
1. Clone the repository:
<pre>
git clone https://github.com/kapr323/weatherapp.git
cd weatherapp
</pre>

2. Start a live server in the src directory (recommending through VS Code Live Server Extension)

3. Open the app in your browser. The default URL is typically `http://127.0.0.1:5500/src/index.html` or `http://localhost:5500/src/index.html`. If you are using a custom domain or port, adjust the URL accordingly.

## Features
- City Search: Autocomplete feature allowing to search for cities
- Weather Forecast: Displays the temperature, date and weather description for next 5 days
- Dynamic Updates: The forecast updates automatically when a new city is selected
- Localization: Dates and times are formatted based on the browser's locale

## Technologies Used
- HTML5: Provides the structure of the app
- CSS3: Handles the styling and layout of the app
- ES6 (Vanilla Javascript): Core application logic and interaction with the DOM
- REST API: Fetches weather data from OpenWeatherMap
- JSON: Provides the dataset for the autocomplete feature

## Project Structure

<pre>
/src  
    ├── index.html
    ├── script.js
    ├── style.css
    └── /data  
        └── cities.json
</pre>

## API Integration
- The app fetches weather data using OpenWeatherMap API:
  - API Endpoint: https://api.openweathermap.org/data/2.5/forecast?q={city_name}&appid={API_key}&units=metric

## Resources
- [MDN Web Docs](https://developer.mozilla.org/en-US/)
- [GitHub Markdown Guide](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)
- [OpenWeatherMap API Documentation](https://openweathermap.org/api)