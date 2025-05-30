/**
 * Weather Service for Smart Fertilizer Recommendation System
 */

class WeatherService {
    constructor(apiKey = null) {
        this.apiKey = apiKey || 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your actual API key
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.useMockData = !apiKey || apiKey === 'YOUR_OPENWEATHERMAP_API_KEY';
    }
    
    /**
     * Get current weather data for a location
     * @param {string} location - Location name or coordinates
     * @returns {Promise} - Weather data promise
     */
    async getCurrentWeather(location) {
        if (this.useMockData) {
            return this.getMockCurrentWeather(location);
        }
        
        try {
            const url = `${this.baseUrl}/weather?q=${encodeURIComponent(location)}&units=metric&appid=${this.apiKey}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching current weather:', error);
            return this.getMockCurrentWeather(location);
        }
    }
    
    /**
     * Get 5-day forecast for a location
     * @param {string} location - Location name or coordinates
     * @returns {Promise} - Forecast data promise
     */
    async getForecast(location) {
        if (this.useMockData) {
            return this.getMockForecast(location);
        }
        
        try {
            const url = `${this.baseUrl}/forecast?q=${encodeURIComponent(location)}&units=metric&appid=${this.apiKey}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching forecast:', error);
            return this.getMockForecast(location);
        }
    }
    
    /**
     * Analyze weather conditions for fertilizer application
     * @param {Object} weatherData - Weather data object
     * @returns {Object} - Weather analysis
     */
    analyzeWeatherForFertilizer(weatherData) {
        if (!weatherData) return null;
        
        // Extract relevant weather parameters
        const temp = weatherData.main?.temp || 25;
        const humidity = weatherData.main?.humidity || 60;
        const windSpeed = weatherData.wind?.speed || 5;
        const rain = weatherData.rain?.['1h'] || 0;
        const weatherCondition = weatherData.weather?.[0]?.main || 'Clear';
        
        // Determine if weather is suitable for fertilizer application
        const isSuitable = this.checkWeatherSuitability(temp, humidity, windSpeed, rain, weatherCondition);
        
        // Generate recommendations based on weather
        const recommendations = this.generateWeatherRecommendations(temp, humidity, windSpeed, rain, weatherCondition);
        
        return {
            temperature: temp,
            humidity: humidity,
            windSpeed: windSpeed,
            rain: rain,
            condition: weatherCondition,
            isSuitable: isSuitable,
            recommendations: recommendations
        };
    }
    
    /**
     * Check if weather is suitable for fertilizer application
     * @param {number} temp - Temperature in Celsius
     * @param {number} humidity - Humidity percentage
     * @param {number} windSpeed - Wind speed in m/s
     * @param {number} rain - Rainfall in mm
     * @param {string} condition - Weather condition
     * @returns {boolean} - Whether weather is suitable
     */
    checkWeatherSuitability(temp, humidity, windSpeed, rain, condition) {
        // Check against weather impact data
        const rainSuitability = rain < weatherImpact.rain.threshold;
        const tempSuitability = temp >= weatherImpact.temperature.min && temp <= weatherImpact.temperature.max;
        const humiditySuitability = humidity >= weatherImpact.humidity.min && humidity <= weatherImpact.humidity.max;
        const windSuitability = windSpeed < 5; // Wind speed less than 5 m/s is suitable
        
        // Check weather condition
        const unsuitable_conditions = ['Thunderstorm', 'Rain', 'Drizzle', 'Snow'];
        const conditionSuitability = !unsuitable_conditions.includes(condition);
        
        // Overall suitability
        return rainSuitability && tempSuitability && humiditySuitability && windSuitability && conditionSuitability;
    }
    
    /**
     * Generate weather-based recommendations
     * @param {number} temp - Temperature in Celsius
     * @param {number} humidity - Humidity percentage
     * @param {number} windSpeed - Wind speed in m/s
     * @param {number} rain - Rainfall in mm
     * @param {string} condition - Weather condition
     * @returns {Object} - Weather recommendations
     */
    generateWeatherRecommendations(temp, humidity, windSpeed, rain, condition) {
        const recommendations = {};
        
        // Temperature recommendations
        if (temp < weatherImpact.temperature.min) {
            recommendations.temperature = 'Temperature is too low for optimal nutrient uptake. Consider waiting for warmer conditions or use foliar spray for better absorption.';
        } else if (temp > weatherImpact.temperature.max) {
            recommendations.temperature = 'Temperature is high, which may cause fertilizer volatilization. Apply in the early morning or evening and consider incorporating into soil.';
        } else {
            recommendations.temperature = 'Current temperature is optimal for fertilizer application and nutrient uptake.';
        }
        
        // Humidity recommendations
        if (humidity < weatherImpact.humidity.min) {
            recommendations.humidity = 'Low humidity may reduce fertilizer effectiveness. Consider irrigating before application or apply during higher humidity periods.';
        } else if (humidity > weatherImpact.humidity.max) {
            recommendations.humidity = 'High humidity may increase disease risk. Ensure good air circulation and consider using fungicides alongside fertilizers.';
        } else {
            recommendations.humidity = 'Current humidity levels are suitable for fertilizer application.';
        }
        
        // Rain recommendations
        if (rain > 0 && rain < 5) {
            recommendations.rain = 'Light rain is beneficial for dissolving fertilizers. Good time for application if rain stops soon.';
        } else if (rain >= 5) {
            recommendations.rain = 'Heavy rain may wash away applied fertilizers. Wait until rain subsides and soil drains adequately.';
        } else {
            recommendations.rain = 'No rain detected. Consider irrigating after fertilizer application for better dissolution.';
        }
        
        // Wind recommendations
        if (windSpeed > 5) {
            recommendations.wind = 'High wind speeds may cause uneven distribution of fertilizers. Wait for calmer conditions, especially for foliar sprays.';
        } else {
            recommendations.wind = 'Current wind conditions are suitable for even fertilizer distribution.';
        }
        
        return recommendations;
    }
    
    /**
     * Generate mock current weather data for demonstration
     * @param {string} location - Location name
     * @returns {Object} - Mock weather data
     */
    getMockCurrentWeather(location) {
        // Generate realistic mock data based on location and current season
        const date = new Date();
        const month = date.getMonth();
        let temp, humidity, condition;
        
        // Simplified seasonal variations
        if (month >= 2 && month <= 4) { // Spring (Mar-May)
            temp = 15 + Math.random() * 10;
            humidity = 50 + Math.random() * 20;
            condition = Math.random() > 0.7 ? 'Rain' : 'Clouds';
        } else if (month >= 5 && month <= 7) { // Summer (Jun-Aug)
            temp = 25 + Math.random() * 10;
            humidity = 60 + Math.random() * 20;
            condition = Math.random() > 0.8 ? 'Rain' : 'Clear';
        } else if (month >= 8 && month <= 10) { // Fall (Sep-Nov)
            temp = 15 + Math.random() * 10;
            humidity = 60 + Math.random() * 20;
            condition = Math.random() > 0.6 ? 'Clouds' : 'Clear';
        } else { // Winter (Dec-Feb)
            temp = 5 + Math.random() * 10;
            humidity = 70 + Math.random() * 20;
            condition = Math.random() > 0.5 ? 'Snow' : 'Clouds';
        }
        
        // Mock data structure similar to OpenWeatherMap API
        return {
            name: location,
            main: {
                temp: Math.round(temp * 10) / 10,
                humidity: Math.round(humidity),
                pressure: 1013 + Math.round(Math.random() * 10 - 5)
            },
            weather: [
                {
                    main: condition,
                    description: this.getWeatherDescription(condition)
                }
            ],
            wind: {
                speed: Math.round(Math.random() * 5 * 10) / 10
            },
            rain: condition === 'Rain' ? { '1h': Math.round(Math.random() * 5 * 10) / 10 } : undefined,
            snow: condition === 'Snow' ? { '1h': Math.round(Math.random() * 2 * 10) / 10 } : undefined
        };
    }
    
    /**
     * Generate mock forecast data for demonstration
     * @param {string} location - Location name
     * @returns {Object} - Mock forecast data
     */
    getMockForecast(location) {
        const list = [];
        const currentDate = new Date();
        const currentWeather = this.getMockCurrentWeather(location);
        
        // Generate forecast for next 5 days, 3-hour intervals
        for (let i = 0; i < 40; i++) { // 5 days * 8 intervals per day
            const forecastDate = new Date(currentDate.getTime() + i * 3 * 60 * 60 * 1000);
            
            // Add some variation to the current weather
            const tempVariation = Math.random() * 6 - 3; // -3 to +3 degrees
            const humidityVariation = Math.random() * 10 - 5; // -5 to +5 percent
            
            // Determine weather condition with some randomness
            let condition = currentWeather.weather[0].main;
            if (Math.random() > 0.7) {
                const conditions = ['Clear', 'Clouds', 'Rain', 'Drizzle'];
                condition = conditions[Math.floor(Math.random() * conditions.length)];
            }
            
            list.push({
                dt: Math.floor(forecastDate.getTime() / 1000),
                main: {
                    temp: Math.round((currentWeather.main.temp + tempVariation) * 10) / 10,
                    humidity: Math.min(100, Math.max(0, Math.round(currentWeather.main.humidity + humidityVariation))),
                    pressure: currentWeather.main.pressure
                },
                weather: [
                    {
                        main: condition,
                        description: this.getWeatherDescription(condition)
                    }
                ],
                wind: {
                    speed: Math.round(Math.random() * 5 * 10) / 10
                },
                rain: condition === 'Rain' || condition === 'Drizzle' ? 
                    { '3h': Math.round(Math.random() * 5 * 10) / 10 } : undefined,
                dt_txt: forecastDate.toISOString().split('.')[0].replace('T', ' ')
            });
        }
        
        return {
            city: {
                name: location,
                country: 'IN' // Assuming India for this application
            },
            list: list
        };
    }
    
    /**
     * Get weather description based on condition
     * @param {string} condition - Weather condition
     * @returns {string} - Weather description
     */
    getWeatherDescription(condition) {
        switch (condition) {
            case 'Clear':
                return 'clear sky';
            case 'Clouds':
                return 'scattered clouds';
            case 'Rain':
                return 'moderate rain';
            case 'Drizzle':
                return 'light rain';
            case 'Snow':
                return 'light snow';
            case 'Thunderstorm':
                return 'thunderstorm';
            default:
                return 'unknown';
        }
    }
}

// Create a global instance of the weather service
const weatherService = new WeatherService();