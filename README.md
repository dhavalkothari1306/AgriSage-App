# AgriSage: Smart Fertilizer Recommendation System

AgriSage is an intelligent web-based application designed to provide personalized fertilizer recommendations for farmers based on soil conditions, crop type, weather patterns, and regional factors. The system aims to optimize agricultural productivity while promoting sustainable farming practices.

## Features

- **Personalized Fertilizer Recommendations**: Generate tailored fertilizer plans based on soil test results, crop selection, and local conditions.
- **Multi-crop Support**: Recommendations for various crops including rice, wheat, maize, sugarcane, cotton, potato, and tomato.
- **Weather Integration**: Real-time weather data analysis to determine optimal fertilizer application timing.
- **Application Schedule**: Detailed schedule for fertilizer application based on crop growth stages.
- **Cost Analysis**: Breakdown of fertilizer costs to help farmers budget effectively.
- **Educational Content**: Tips and best practices for soil health management and sustainable farming.
- **Multilingual Support**: Available in English, Hindi, Kannada, Telugu, and Tamil to serve diverse farming communities.
- **Responsive Design**: Works seamlessly on desktop and mobile devices for field use.

## Setup Instructions

1. Clone the repository
2. Open `index.html` in your web browser
3. For weather integration, replace `YOUR_OPENWEATHERMAP_API_KEY` in `js/weather.js` with your actual API key

## API Integration

The system is designed to integrate with the OpenWeatherMap API for real-time weather data. To enable this feature:

1. Sign up for an API key at [OpenWeatherMap](https://openweathermap.org/api)
2. Replace the placeholder in `js/weather.js` with your API key

Note: The system includes a mock weather service that provides realistic data for demonstration purposes if no API key is provided.

## Technologies Used

- HTML5, CSS3, JavaScript (ES6+)
- Responsive design with CSS Grid and Flexbox
- Weather data from OpenWeatherMap API
- Local storage for saving user preferences

## Future Enhancements

- Integration with soil testing APIs
- Machine learning models for yield prediction
- Community features for sharing regional best practices
- Mobile application with offline capabilities
- Integration with e-commerce platforms for fertilizer purchasing

## License

This project is licensed under the MIT License - see the LICENSE file for details.
