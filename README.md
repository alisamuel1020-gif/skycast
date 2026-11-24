# Skycast 🌤️

Skycast is an interactive weather forecasting web application built with HTML, CSS, and JavaScript. It provides real-time weather information, hourly forecasts, and a 7-day weather outlook through a clean, responsive interface.

The application integrates the Open-Meteo Geocoding and Weather APIs to retrieve weather information for different locations.

## Features

### Weather Information
- Current temperature and weather conditions.
- Feels-like temperature.
- Daily minimum and maximum temperatures.
- Relative humidity.
- Wind speed and direction.
- Atmospheric pressure.
- UV index.
- Sunrise and sunset times.
- Probability of precipitation.

### Weather Forecasts
- Hourly weather forecast for the next 24 hours.
- 7-day weather forecast.
- Daily temperature range visualization.

### Location & Search
- Search for cities around the world.
- Browser-based location detection.
- Quick access to suggested cities.
- Automatic restoration of the last selected location.

### User Experience
- Celsius and Fahrenheit temperature conversion.
- Dynamic backgrounds based on weather conditions.
- Light and dark weather themes.
- Animated rain and snow effects.
- Responsive interface for desktop and mobile devices.
- Loading indicators and error messages.
- Keyboard accessibility.
- Reduced-motion support.

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | Styling and responsive design |
| JavaScript | Application logic and API integration |
| Open-Meteo Geocoding API | City search and coordinates |
| Open-Meteo Forecast API | Weather information |
| Browser Geolocation API | User location detection |
| HTML Canvas API | Weather animations |
| Local Storage | Saving user preferences and location |

## Project Structure

```text
Skycast/
│
├── index.html       # Application structure
├── styles.css       # Styling and responsive design
├── app.js           # Application logic and API integration
└── README.md        # Project documentation
```

## Getting Started

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
```

### 2. Navigate into the Project Directory

```bash
cd Skycast
```

### 3. Run the Application

Open `index.html` in your browser or use a local development server.

For example, with the VS Code Live Server extension, right-click `index.html` and select **Open with Live Server**.

## API Integration

Skycast uses the Open-Meteo APIs to retrieve weather information.

### Geocoding API

Used to search for cities and retrieve their geographical coordinates.

```text
https://geocoding-api.open-meteo.com/v1/search
```

### Forecast API

Used to retrieve current weather conditions, hourly forecasts, and daily forecasts.

```text
https://api.open-meteo.com/v1/forecast
```

No API key is required for the public endpoints used by this project.

API documentation:

- Geocoding: https://open-meteo.com/en/docs/geocoding-api
- Weather Forecast: https://open-meteo.com/en/docs

## How It Works

1. Users search for a city or allow the browser to access their location.
2. The application retrieves geographical coordinates.
3. JavaScript sends a request to the Open-Meteo Forecast API.
4. The returned weather data is processed and displayed dynamically.
5. The interface updates its background and animations according to weather conditions.
6. Users can switch between Celsius and Fahrenheit.

## Browser Support

Skycast uses modern browser features, including:

- Fetch API.
- Local Storage.
- Geolocation API.
- Canvas API.
- CSS backdrop filters.
- JavaScript ES6+ features.

Location detection requires browser permission and a secure context, such as HTTPS or localhost.

## Future Improvements

Potential enhancements include:

- Weather alerts and notifications.
- Improved weather map integration.
- Additional forecast information.
- More detailed weather statistics.
- Progressive Web App (PWA) support.

## Author

**Ali Samuel**

Software Engineer | Web Developer | AI & Automation Specialist

GitHub: https://github.com/alisamuel1020-gif

## License

Created for learning and demonstration purposes.
