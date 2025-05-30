/**
 * Main application script for Smart Fertilizer Recommendation System
 */

// DOM Elements
const cropTypeSelect = document.getElementById('cropType');
const soilTypeSelect = document.getElementById('soilType');
const regionSelect = document.getElementById('regionSelect');
const locationInput = document.getElementById('location');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const fertilizerForm = document.getElementById('fertilizerForm');
const resetBtn = document.getElementById('resetBtn');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const cropInfoContent = document.getElementById('cropInfoContent');
const weatherInfoContent = document.getElementById('weatherInfoContent');
const recommendationContent = document.getElementById('recommendationContent');
const scheduleContent = document.getElementById('scheduleContent');
const costContent = document.getElementById('costContent');
const educationContent = document.getElementById('educationContent');
const yieldPredictionContent = document.getElementById('yieldPredictionContent');
const resultsSection = document.getElementById('resultsSection');
const languageSelect = document.getElementById('language');
const languageNotification = document.getElementById('languageNotification');
const languageNotificationText = document.getElementById('languageNotificationText');

// Event Listeners
cropTypeSelect.addEventListener('change', displayCropInfo);
getWeatherBtn.addEventListener('click', fetchWeather);
fertilizerForm.addEventListener('submit', handleFormSubmit);
resetBtn.addEventListener('click', resetForm);
languageSelect.addEventListener('change', changeLanguage);

// Add event listeners to tab buttons
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

/**
 * Display crop information when crop type is selected
 */
function displayCropInfo() {
    const cropType = cropTypeSelect.value;
    if (!cropType) {
        cropInfoContent.innerHTML = `<p data-translate="selectCropFirst">Please select a crop first.</p>`;
        return;
    }
    
    const crop = cropData[cropType];
    if (!crop) return;
    
    const nutrientReq = crop.nutrientRequirements;
    
    let html = `
        <div class="crop-details">
            <h4 data-translate="nutrientRequirements">Nutrient Requirements</h4>
            <div class="nutrient-req">
                <div class="nutrient-item">
                    <div class="nutrient-name">N</div>
                    <div class="nutrient-value">${nutrientReq.n.min}-${nutrientReq.n.max} kg/ha</div>
                </div>
                <div class="nutrient-item">
                    <div class="nutrient-name">P</div>
                    <div class="nutrient-value">${nutrientReq.p.min}-${nutrientReq.p.max} kg/ha</div>
                </div>
                <div class="nutrient-item">
                    <div class="nutrient-name">K</div>
                    <div class="nutrient-value">${nutrientReq.k.min}-${nutrientReq.k.max} kg/ha</div>
                </div>
            </div>
            
            <h4 data-translate="growthStages">Growth Stages</h4>
            <ul>
    `;
    
    crop.growthStages.forEach(stage => {
        html += `<li><strong>${stage.name}</strong>: ${stage.description} (${stage.days})</li>`;
    });
    
    html += `</ul></div>`;
    
    cropInfoContent.innerHTML = html;
    translatePage();
}

/**
 * Fetch weather data for the specified location
 */
async function fetchWeather() {
    const location = locationInput.value.trim();
    if (!location) {
        alert(getTranslation('enterLocation'));
        return;
    }
    
    weatherInfoContent.innerHTML = `<p data-translate="fetchingWeather">Fetching weather data...</p>`;
    
    try {
        const weatherData = await weatherService.getCurrentWeather(location);
        if (!weatherData) {
            weatherInfoContent.innerHTML = `<p data-translate="weatherError">Error fetching weather data. Please try again.</p>`;
            return;
        }
        
        const weatherAnalysis = weatherService.analyzeWeatherForFertilizer(weatherData);
        
        // Update recommendation engine with weather analysis
        recommendationEngine.setWeatherAnalysis(weatherAnalysis);
        
        // Display weather information
        displayWeatherInfo(weatherData, weatherAnalysis);
    } catch (error) {
        console.error('Error:', error);
        weatherInfoContent.innerHTML = `<p data-translate="weatherError">Error fetching weather data. Please try again.</p>`;
    }
}

/**
 * Display weather information and analysis
 * @param {Object} weatherData - Weather data from API
 * @param {Object} analysis - Weather analysis for fertilizer application
 */
function displayWeatherInfo(weatherData, analysis) {
    const iconClass = getWeatherIconClass(weatherData.weather[0].main);
    const suitabilityClass = analysis.isSuitable ? 'suitable' : 'not-suitable';
    
    const html = `
        <div class="weather-display">
            <div class="weather-icon">
                <i class="${iconClass}"></i>
            </div>
            <div class="weather-details">
                <div class="weather-temp">${Math.round(weatherData.main.temp)}°C</div>
                <div class="weather-desc">${weatherData.weather[0].description}</div>
                <div>Humidity: ${weatherData.main.humidity}%</div>
                <div>Wind: ${weatherData.wind.speed} km/h</div>
            </div>
        </div>
        
        <div class="weather-suitability ${suitabilityClass}">
            ${analysis.summary}
        </div>
        
        <div class="weather-recommendations">
            <h4 data-translate="weatherRecommendations">Weather-based Recommendations:</h4>
            <ul>
                <li>${analysis.recommendations.temperature}</li>
                <li>${analysis.recommendations.humidity}</li>
                <li>${analysis.recommendations.rain}</li>
            </ul>
        </div>
    `;
    
    weatherInfoContent.innerHTML = html;
    translatePage();
}

/**
 * Get Font Awesome icon class based on weather condition
 * @param {string} weatherCondition - Weather condition
 * @returns {string} - Font Awesome icon class
 */
function getWeatherIconClass(weatherCondition) {
    switch (weatherCondition.toLowerCase()) {
        case 'clear':
            return 'fas fa-sun';
        case 'clouds':
            return 'fas fa-cloud';
        case 'rain':
            return 'fas fa-cloud-rain';
        case 'thunderstorm':
            return 'fas fa-bolt';
        case 'snow':
            return 'fas fa-snowflake';
        case 'mist':
        case 'fog':
            return 'fas fa-smog';
        default:
            return 'fas fa-cloud';
    }
}

/**
 * Handle form submission for fertilizer recommendation
 * @param {Event} event - Form submission event
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form values
    const cropType = cropTypeSelect.value;
    const soilType = soilTypeSelect.value;
    const region = document.getElementById('region').value;
    const soilPH = parseFloat(document.getElementById('soilPH').value);
    const nitrogenLevel = parseFloat(document.getElementById('nitrogenLevel').value);
    const phosphorusLevel = parseFloat(document.getElementById('phosphorusLevel').value);
    const potassiumLevel = parseFloat(document.getElementById('potassiumLevel').value);
    const organicMatter = parseFloat(document.getElementById('organicMatter').value) || 0;
    
    // Validate inputs
    if (!cropType || !soilType || !region || isNaN(soilPH) || isNaN(nitrogenLevel) || 
        isNaN(phosphorusLevel) || isNaN(potassiumLevel)) {
        alert(getTranslation('fillAllFields'));
        return;
    }
    
    // Set data in recommendation engine
    recommendationEngine.setCropType(cropType);
    recommendationEngine.setSoilData({
        type: soilType,
        ph: soilPH,
        n: nitrogenLevel,
        p: phosphorusLevel,
        k: potassiumLevel,
        organicMatter: organicMatter
    });
    recommendationEngine.setRegion(region);
    
    // Generate recommendation
    const recommendation = recommendationEngine.generateRecommendation();
    
    // Display results
    displayFertilizerRecommendation(recommendation.fertilizerPlan);
    displayYieldPrediction(recommendation.yieldPrediction);
    displayApplicationSchedule(recommendation.applicationSchedule);
    displayCostBreakdown(recommendation.costBreakdown);
    displayEducationalTips(recommendation.educationalTips);
    
    // Show results section
    resultsSection.style.display = 'block';
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Display fertilizer recommendation
 * @param {Array} fertilizerPlan - Fertilizer plan
 */
function displayFertilizerRecommendation(fertilizerPlan) {
    if (!fertilizerPlan || fertilizerPlan.length === 0) {
        recommendationContent.innerHTML = `<p data-translate="noRecommendation">No recommendation available.</p>`;
        return;
    }
    
    let html = '';
    
    fertilizerPlan.forEach(fert => {
        html += `
            <div class="recommendation-item">
                <h4><i class="fas fa-flask"></i> ${fert.name}</h4>
                <p><strong data-translate="quantity">Quantity:</strong> ${Math.round(fert.quantity)} kg/ha</p>
                <p><strong data-translate="composition">Composition:</strong> ${fert.composition}</p>
                <p><strong data-translate="description">Description:</strong> ${fert.description}</p>
                <div class="nutrient-provided">
                    <span class="nutrient-tag">N: ${fert.nutrientProvided.n} kg/ha</span>
                    <span class="nutrient-tag">P: ${fert.nutrientProvided.p} kg/ha</span>
                    <span class="nutrient-tag">K: ${fert.nutrientProvided.k} kg/ha</span>
                </div>
            </div>
        `;
    });
    
    recommendationContent.innerHTML = html;
    translatePage();
}

/**
 * Display yield prediction
 * @param {Object} yieldPrediction - Yield prediction data
 */
function displayYieldPrediction(yieldPrediction) {
    if (!yieldPrediction) {
        yieldPredictionContent.innerHTML = `<p data-translate="noPrediction">No yield prediction available.</p>`;
        return;
    }
    
    const html = `
        <div class="yield-chart">
            <p data-translate="baseYield">Base Yield: ${yieldPrediction.baseYield}</p>
            <div class="improvement-percentage">+${yieldPrediction.predictedImprovement}%</div>
            <p data-translate="predictedImprovement">Predicted Improvement</p>
            
            <h4 data-translate="contributingFactors">Contributing Factors:</h4>
            <div class="factors-list">
                <div class="factor-item">
                    <span data-translate="soilHealth">Soil Health</span>
                    <span class="factor-value">+${yieldPrediction.factors.soilHealth}%</span>
                </div>
                <div class="factor-item">
                    <span data-translate="weatherConditions">Weather Conditions</span>
                    <span class="factor-value">+${yieldPrediction.factors.weather}%</span>
                </div>
                <div class="factor-item">
                    <span data-translate="fertilization">Fertilization</span>
                    <span class="factor-value">+${yieldPrediction.factors.fertilization}%</span>
                </div>
            </div>
        </div>
    `;
    
    yieldPredictionContent.innerHTML = html;
    translatePage();
}

/**
 * Display application schedule
 * @param {Array} schedule - Application schedule
 */
function displayApplicationSchedule(schedule) {
    if (!schedule || schedule.length === 0) {
        scheduleContent.innerHTML = `<p data-translate="noSchedule">No application schedule available.</p>`;
        return;
    }
    
    let html = '';
    
    schedule.forEach(stage => {
        let fertilizersHtml = '';
        
        stage.fertilizers.forEach(fert => {
            fertilizersHtml += `
                <div class="schedule-fertilizer-item">
                    <span>${fert.name}</span>
                    <span>${fert.quantity} kg/ha</span>
                    <span>${fert.method}</span>
                </div>
            `;
        });
        
        html += `
            <div class="schedule-stage">
                <h4>${stage.stageName}</h4>
                <p class="schedule-desc">${stage.stageDescription}</p>
                <div class="schedule-fertilizers">
                    <div class="schedule-fertilizer-item">
                        <strong data-translate="fertilizerName">Fertilizer</strong>
                        <strong data-translate="quantity">Quantity</strong>
                        <strong data-translate="applicationMethod">Method</strong>
                    </div>
                    ${fertilizersHtml}
                </div>
            </div>
        `;
    });
    
    scheduleContent.innerHTML = html;
    translatePage();
}

/**
 * Display cost breakdown
 * @param {Object} costBreakdown - Cost breakdown data
 */
function displayCostBreakdown(costBreakdown) {
    if (!costBreakdown || !costBreakdown.details || costBreakdown.details.length === 0) {
        costContent.innerHTML = `<p data-translate="noCost">No cost breakdown available.</p>`;
        return;
    }
    
    let tableRows = '';
    
    costBreakdown.details.forEach(item => {
        tableRows += `
            <tr>
                <td>${item.name}</td>
                <td>${Math.round(item.quantity)} kg/ha</td>
                <td>₹${item.unitCost.toFixed(2)}/kg</td>
                <td>₹${Math.round(item.totalCost)}</td>
            </tr>
        `;
    });
    
    const html = `
        <div class="cost-summary">
            <p data-translate="totalCostLabel">Total Fertilizer Cost:</p>
            <div class="total-cost">₹${Math.round(costBreakdown.totalCost)}</div>
            <p data-translate="costPerHectare">Cost per hectare: ₹${Math.round(costBreakdown.costPerHectare)}</p>
        </div>
        
        <table class="cost-table">
            <thead>
                <tr>
                    <th data-translate="fertilizerName">Fertilizer</th>
                    <th data-translate="quantity">Quantity</th>
                    <th data-translate="unitCost">Unit Cost</th>
                    <th data-translate="totalCost">Total Cost</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    `;
    
    costContent.innerHTML = html;
    translatePage();
}

/**
 * Display educational tips
 * @param {Array} tips - Educational tips
 */
function displayEducationalTips(tips) {
    if (!tips || tips.length === 0) {
        educationContent.innerHTML = `<p data-translate="noTips">No educational tips available.</p>`;
        return;
    }
    
    let html = '';
    
    tips.forEach((tip, index) => {
        html += `
            <div class="tip-item">
                <h4><i class="fas fa-lightbulb"></i> Tip ${index + 1}</h4>
                <p>${tip}</p>
            </div>
        `;
    });
    
    educationContent.innerHTML = html;
    translatePage();
}

/**
 * Switch between tabs
 * @param {string} tabId - Tab ID to switch to
 */
function switchTab(tabId) {
    // Remove active class from all buttons and contents
    tabBtns.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    const selectedBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (selectedBtn) selectedBtn.classList.add('active');
    
    const selectedContent = document.getElementById(tabId);
    if (selectedContent) selectedContent.classList.add('active');
}

/**
 * Reset the form
 */
function resetForm() {
    fertilizerForm.reset();
    cropInfoContent.innerHTML = '';
    weatherInfoContent.innerHTML = `<p data-translate="fetchWeather">Please fetch weather data first.</p>`;
    recommendationContent.innerHTML = '';
    scheduleContent.innerHTML = '';
    costContent.innerHTML = '';
    educationContent.innerHTML = '';
    yieldPredictionContent.innerHTML = '';
    resultsSection.style.display = 'none';
    
    // Reset recommendation engine
    recommendationEngine.setCropType(null);
    recommendationEngine.setSoilData(null);
    recommendationEngine.setWeatherAnalysis(null);
    recommendationEngine.setRegion(null);
    
    translatePage();
}

/**
 * Initialize tooltips
 */
function initTooltips() {
    // This is a placeholder for tooltip initialization
    // You can implement a tooltip library here if needed
}

/**
 * Change the language of the application
 */
function changeLanguage() {
    const selectedLanguage = languageSelect.value;
    localStorage.setItem('preferredLanguage', selectedLanguage);
    
    // Show notification
    let languageName = '';
    switch (selectedLanguage) {
        case 'en':
            languageName = 'English';
            break;
        case 'hi':
            languageName = 'हिंदी (Hindi)';
            break;
        case 'kn':
            languageName = 'ಕನ್ನಡ (Kannada)';
            break;
        case 'te':
            languageName = 'తెలుగు (Telugu)';
            break;
        case 'ta':
            languageName = 'தமிழ் (Tamil)';
            break;
    }
    
    languageNotificationText.textContent = `Language changed to ${languageName}`;
    languageNotification.style.animation = 'none';
    setTimeout(() => {
        languageNotification.style.animation = 'fadeInOut 3s ease-in-out';
    }, 10);
    
    translatePage();
}

/**
 * Translate the page to the selected language
 */
function translatePage() {
    const selectedLanguage = languageSelect.value;
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[selectedLanguage] && translations[selectedLanguage][key]) {
            if (element.tagName === 'INPUT' && element.type === 'placeholder') {
                element.placeholder = translations[selectedLanguage][key];
            } else {
                element.textContent = translations[selectedLanguage][key];
            }
        }
    });
}

/**
 * Get translation for a key
 * @param {string} key - Translation key
 * @returns {string} - Translated text
 */
function getTranslation(key) {
    const selectedLanguage = languageSelect.value;
    if (translations[selectedLanguage] && translations[selectedLanguage][key]) {
        return translations[selectedLanguage][key];
    }
    return translations['en'][key] || key;
}

// Translations for the application
const translations = {
    'en': {
        'title': 'Smart Fertilizer Recommendation System',
        'selectLanguage': 'Select Language:',
        'inputDetails': 'Input Details',
        'cropType': 'Crop Type:',
        'selectCrop': 'Select Crop',
        'soilType': 'Soil Type:',
        'selectSoil': 'Select Soil Type',
        'region': 'Region:',
        'selectRegion': 'Select Region',
        'location': 'Location (for weather):',
        'getWeather': 'Get Weather',
        'soilTestResults': 'Soil Test Results',
        'soilPH': 'Soil pH:',
        'nitrogenLevel': 'Nitrogen Level (kg/ha):',
        'phosphorusLevel': 'Phosphorus Level (kg/ha):',
        'potassiumLevel': 'Potassium Level (kg/ha):',
        'organicMatter': 'Organic Matter (%):',
        'getRecommendation': 'Get Fertilizer Recommendation',
        'resetForm': 'Reset Form',
        'recommendation': 'Recommendation',
        'schedule': 'Application Schedule',
        'cost': 'Cost Analysis',
        'education': 'Education',
        'cropInformation': 'Crop Information',
        'weatherConditions': 'Weather Conditions',
        'fertilizerRecommendation': 'Fertilizer Recommendation',
        'yieldPrediction': 'Yield Prediction',
        'applicationSchedule': 'Application Schedule',
        'costBreakdown': 'Cost Breakdown',
        'educationalTips': 'Educational Tips',
        'footer': '© 2023 Smart Fertilizer Recommendation System | Developed for sustainable agriculture',
        'selectCropFirst': 'Please select a crop first.',
        'enterLocation': 'Please enter a location.',
        'fetchingWeather': 'Fetching weather data...',
        'weatherError': 'Error fetching weather data. Please try again.',
        'weatherRecommendations': 'Weather-based Recommendations:',
        'fillAllFields': 'Please fill all required fields.',
        'noRecommendation': 'No recommendation available.',
        'quantity': 'Quantity:',
        'composition': 'Composition:',
        'description': 'Description:',
        'noPrediction': 'No yield prediction available.',
        'baseYield': 'Base Yield:',
        'predictedImprovement': 'Predicted Improvement',
        'contributingFactors': 'Contributing Factors:',
        'soilHealth': 'Soil Health',
        'fertilization': 'Fertilization',
        'noSchedule': 'No application schedule available.',
        'fertilizerName': 'Fertilizer',
        'applicationMethod': 'Method',
        'noCost': 'No cost breakdown available.',
        'totalCostLabel': 'Total Fertilizer Cost:',
        'costPerHectare': 'Cost per hectare:',
        'unitCost': 'Unit Cost',
        'totalCost': 'Total Cost',
        'noTips': 'No educational tips available.',
        'fetchWeather': 'Please fetch weather data first.',
        'nutrientRequirements': 'Nutrient Requirements',
        'growthStages': 'Growth Stages'
    },
    'hi': {
        'title': 'स्मार्ट उर्वरक अनुशंसा प्रणाली',
        'selectLanguage': 'भाषा चुनें:',
        'inputDetails': 'इनपुट विवरण',
        'cropType': 'फसल प्रकार:',
        'selectCrop': 'फसल चुनें',
        'soilType': 'मिट्टी का प्रकार:',
        'selectSoil': 'मिट्टी का प्रकार चुनें',
        'region': 'क्षेत्र:',
        'selectRegion': 'क्षेत्र चुनें',
        'location': 'स्थान (मौसम के लिए):',
        'getWeather': 'मौसम प्राप्त करें',
        'soilTestResults': 'मिट्टी परीक्षण परिणाम',
        'soilPH': 'मिट्टी का पीएच:',
        'nitrogenLevel': 'नाइट्रोजन स्तर (किग्रा/हेक्टेयर):',
        'phosphorusLevel': 'फास्फोरस स्तर (किग्रा/हेक्टेयर):',
        'potassiumLevel': 'पोटेशियम स्तर (किग्रा/हेक्टेयर):',
        'organicMatter': 'जैविक पदार्थ (%):',
        'getRecommendation': 'उर्वरक अनुशंसा प्राप्त करें',
        'resetForm': 'फॉर्म रीसेट करें',
        'recommendation': 'अनुशंसा',
        'schedule': 'अनुप्रयोग अनुसूची',
        'cost': 'लागत विश्लेषण',
        'education': 'शिक्षा',
        'cropInformation': 'फसल जानकारी',
        'weatherConditions': 'मौसम की स्थिति',
        'fertilizerRecommendation': 'उर्वरक अनुशंसा',
        'yieldPrediction': 'उपज भविष्यवाणी',
        'applicationSchedule': 'अनुप्रयोग अनुसूची',
        'costBreakdown': 'लागत विश्लेषण',
        'educationalTips': 'शैक्षिक टिप्स',
        'footer': '© 2023 स्मार्ट उर्वरक अनुशंसा प्रणाली | टिकाऊ कृषि के लिए विकसित',
        'selectCropFirst': 'कृपया पहले फसल चुनें।',
        'enterLocation': 'कृपया स्थान दर्ज करें।',
        'fetchingWeather': 'मौसम डेटा प्राप्त कर रहे हैं...',
        'weatherError': 'मौसम डेटा प्राप्त करने में त्रुटि। कृपया पुन: प्रयास करें।',
        'weatherRecommendations': 'मौसम-आधारित अनुशंसाएँ:',
        'fillAllFields': 'कृपया सभी आवश्यक फ़ील्ड भरें।',
        'noRecommendation': 'कोई अनुशंसा उपलब्ध नहीं है।',
        'quantity': 'मात्रा:',
        'composition': 'संरचना:',
        'description': 'विवरण:',
        'noPrediction': 'कोई उपज भविष्यवाणी उपलब्ध नहीं है।',
        'baseYield': 'आधार उपज:',
        'predictedImprovement': 'अनुमानित सुधार',
        'contributingFactors': 'योगदान कारक:',
        'soilHealth': 'मिट्टी का स्वास्थ्य',
        'fertilization': 'उर्वरक',
        'noSchedule': 'कोई अनुप्रयोग अनुसूची उपलब्ध नहीं है।',
        'fertilizerName': 'उर्वरक',
        'applicationMethod': 'विधि',
        'noCost': 'कोई लागत विश्लेषण उपलब्ध नहीं है।',
        'totalCostLabel': 'कुल उर्वरक लागत:',
        'costPerHectare': 'प्रति हेक्टेयर लागत:',
        'unitCost': 'इकाई लागत',
        'totalCost': 'कुल लागत',
        'noTips': 'कोई शैक्षिक टिप्स उपलब्ध नहीं हैं।',
        'fetchWeather': 'कृपया पहले मौसम डेटा प्राप्त करें।',
        'nutrientRequirements': 'पोषक तत्व आवश्यकताएँ',
        'growthStages': 'विकास के चरण'
    },
    'kn': {
        'title': 'ಸ್ಮಾರ್ಟ್ ರಸಗೊಬ್ಬರ ಶಿಫಾರಸು ವ್ಯವಸ್ಥೆ',
        'selectLanguage': 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:',
        'inputDetails': 'ಇನ್‌ಪುಟ್ ವಿವರಗಳು',
        'cropType': 'ಬೆಳೆ ಪ್ರಕಾರ:',
        'selectCrop': 'ಬೆಳೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        'soilType': 'ಮಣ್ಣಿನ ಪ್ರಕಾರ:',
        'selectSoil': 'ಮಣ್ಣಿನ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        'region': 'ಪ್ರದೇಶ:',
        'selectRegion': 'ಪ್ರದೇಶವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        'location': 'ಸ್ಥಳ (ಹವಾಮಾನಕ್ಕಾಗಿ):',
        'getWeather': 'ಹವಾಮಾನ ಪಡೆಯಿರಿ',
        'soilTestResults': 'ಮಣ್ಣು ಪರೀಕ್ಷೆ ಫಲಿತಾಂಶಗಳು',
        'soilPH': 'ಮಣ್ಣಿನ pH:',
        'nitrogenLevel': 'ನೈಟ್ರೋಜನ್ ಮಟ್ಟ (ಕೆಜಿ/ಹೆಕ್ಟೇರ್):',
        'phosphorusLevel': 'ಫಾಸ್ಫರಸ್ ಮಟ್ಟ (ಕೆಜಿ/ಹೆಕ್ಟೇರ್):',
        'potassiumLevel': 'ಪೊಟ್ಯಾಸಿಯಂ ಮಟ್ಟ (ಕೆಜಿ/ಹೆಕ್ಟೇರ್):',
        'organicMatter': 'ಸಾವಯವ ವಸ್ತು (%):',
        'getRecommendation': 'ರಸಗೊಬ್ಬರ ಶಿಫಾರಸು ಪಡೆಯಿರಿ',
        'resetForm': 'ಫಾರ್ಮ್ ಮರುಹೊಂದಿಸಿ',
        'recommendation': 'ಶಿಫಾರಸು',
        'schedule': 'ಅಪ್ಲಿಕೇಶನ್ ವೇಳಾಪಟ್ಟಿ',
        'cost': 'ವೆಚ್ಚ ವಿಶ್ಲೇಷಣೆ',
        'education': 'ಶಿಕ್ಷಣ',
        'cropInformation': 'ಬೆಳೆ ಮಾಹಿತಿ',
        'weatherConditions': 'ಹವಾಮಾನ ಪರಿಸ್ಥಿತಿಗಳು',
        'fertilizerRecommendation': 'ರಸಗೊಬ್ಬರ ಶಿಫಾರಸು',
        'yieldPrediction': 'ಇಳುವರಿ ಮುನ್ಸೂಚನೆ',
        'applicationSchedule': 'ಅಪ್ಲಿಕೇಶನ್ ವೇಳಾಪಟ್ಟಿ',
        'costBreakdown': 'ವೆಚ್ಚ ವಿಶ್ಲೇಷಣೆ',
        'educationalTips': 'ಶೈಕ್ಷಣಿಕ ಸಲಹೆಗಳು',
        'footer': '© 2023 ಸ್ಮಾರ್ಟ್ ರಸಗೊಬ್ಬರ ಶಿಫಾರಸು ವ್ಯವಸ್ಥೆ | ಸುಸ್ಥಿರ ಕೃಷಿಗಾಗಿ ಅಭಿವೃದ್ಧಿಪಡಿಸಲಾಗಿದೆ',
        'selectCropFirst': 'ದಯವಿಟ್ಟು ಮೊದಲು ಬೆಳೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
        'enterLocation': 'ದಯವಿಟ್ಟು ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ.',
        'fetchingWeather': 'ಹವಾಮಾನ ಡೇಟಾವನ್ನು ಪಡೆಯಲಾಗುತ್ತಿದೆ...',
        'weatherError': 'ಹವಾಮಾನ ಡೇಟಾವನ್ನು ಪಡೆಯುವಲ್ಲಿ ದೋಷ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
        'weatherRecommendations': 'ಹವಾಮಾನ-ಆಧಾರಿತ ಶಿಫಾರಸುಗಳು:',
        'fillAllFields': 'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.',
        'noRecommendation': 'ಯಾವುದೇ ಶಿಫಾರಸು ಲಭ್ಯವಿಲ್ಲ.',
        'quantity': 'ಪ್ರಮಾಣ:',
        'composition': 'ಸಂಯೋಜನೆ:',
        'description': 'ವಿವರಣೆ:',
        'noPrediction': 'ಯಾವುದೇ ಇಳುವರಿ ಮುನ್ಸೂಚನೆ ಲಭ್ಯವಿಲ್ಲ.',
        'baseYield': 'ಮೂಲ ಇಳುವರಿ:',
        'predictedImprovement': 'ಊಹಿಸಿದ ಸುಧಾರಣೆ',
        'contributingFactors': 'ಕೊಡುಗೆ ನೀಡುವ ಅಂಶಗಳು:',
        'soilHealth': 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ',
        'fertilization': 'ರಸಗೊಬ್ಬರ',
        'noSchedule': 'ಯಾವುದೇ ಅಪ್ಲಿಕೇಶನ್ ವೇಳಾಪಟ್ಟಿ ಲಭ್ಯವಿಲ್ಲ.',
        'fertilizerName': 'ರಸಗೊಬ್ಬರ',
        'applicationMethod': 'ವಿಧಾನ',
        'noCost': 'ಯಾವುದೇ ವೆಚ್ಚ ವಿಶ್ಲೇಷಣೆ ಲಭ್ಯವಿಲ್ಲ.',
        'totalCostLabel': 'ಒಟ್ಟು ರಸಗೊಬ್ಬರ ವೆಚ್ಚ:',
        'costPerHectare': 'ಪ್ರತಿ ಹೆಕ್ಟೇರ್‌ಗೆ ವೆಚ್ಚ:',
        'unitCost': 'ಘಟಕ ವೆಚ್ಚ',
        'totalCost': 'ಒಟ್ಟು ವೆಚ್ಚ',
        'noTips': 'ಯಾವುದೇ ಶೈಕ್ಷಣಿಕ ಸಲಹೆಗಳು ಲಭ್ಯವಿಲ್ಲ.',
        'fetchWeather': 'ದಯವಿಟ್ಟು ಮೊದಲು ಹವಾಮಾನ ಡೇಟಾವನ್ನು ಪಡೆಯಿರಿ.',
        'nutrientRequirements': 'ಪೋಷಕಾಂಶ ಅವಶ್ಯಕತೆಗಳು',
        'growthStages': 'ಬೆಳವಣಿಗೆ ಹಂತಗಳು'
    },
    'te': {
        'title': 'స్మార్ట్ ఎరువుల సిఫార్సు వ్యవస్థ',
        'selectLanguage': 'భాష ఎంచుకోండి:',
        'inputDetails': 'ఇన్‌పుట్ వివరాలు',
        'cropType': 'పంట రకం:',
        'selectCrop': 'పంటను ఎంచుకోండి',
        'soilType': 'నేల రకం:',
        'selectSoil': 'నేల రకాన్ని ఎంచుకోండి',
        'region': 'ప్రాంతం:',
        'selectRegion': 'ప్రాంతాన్ని ఎంచుకోండి',
        'location': 'స్థానం (వాతావరణం కోసం):',
        'getWeather': 'వాతావరణాన్ని పొందండి',
        'soilTestResults': 'నేల పరీక్ష ఫలితాలు',
        'soilPH': 'నేల pH:',
        'nitrogenLevel': 'నత్రజని స్థాయి (కేజీ/హెక్టారు):',
        'phosphorusLevel': 'ఫాస్పరస్ స్థాయి (కేజీ/హెక్టారు):',
        'potassiumLevel': 'పొటాషియం స్థాయి (కేజీ/హెక్టారు):',
        'organicMatter': 'సేంద్రియ పదార్థం (%):',
        'getRecommendation': 'ఎరువుల సిఫార్సును పొందండి',
        'resetForm': 'ఫారమ్‌ను రీసెట్ చేయండి',
        'recommendation': 'సిఫార్సు',
        'schedule': 'అప్లికేషన్ షెడ్యూల్',
        'cost': 'ఖర్చు విశ్లేషణ',
        'education': 'విద్య',
        'cropInformation': 'పంట సమాచారం',
        'weatherConditions': 'వాతావరణ పరిస్థితులు',
        'fertilizerRecommendation': 'ఎరువుల సిఫార్సు',
        'yieldPrediction': 'దిగుబడి అంచనా',
        'applicationSchedule': 'అప్లికేషన్ షెడ్యూల్',
        'costBreakdown': 'ఖర్చు విశ్లేషణ',
        'educationalTips': 'విద్యా చిట్కాలు',
        'footer': '© 2023 స్మార్ట్ ఎరువుల సిఫార్సు వ్యవస్థ | సుస్థిర వ్యవసాయం కోసం అభివృద్ధి చేయబడింది',
        'selectCropFirst': 'దయచేసి ముందుగా పంటను ఎంచుకోండి.',
        'enterLocation': 'దయచేసి స్థానాన్ని నమోదు చేయండి.',
        'fetchingWeather': 'వాతావరణ డేటాను పొందుతోంది...',
        'weatherError': 'వాతావరణ డేటాను పొందడంలో లోపం. దయచేసి మళ్లీ ప్రయత్నించండి.',
        'weatherRecommendations': 'వాతావరణ-ఆధారిత సిఫార్సులు:',
        'fillAllFields': 'దయచేసి అన్ని అవసరమైన ఫీల్డ్‌లను పూరించండి.',
        'noRecommendation': 'సిఫార్సు అందుబాటులో లేదు.',
        'quantity': 'పరిమాణం:',
        'composition': 'కూర్పు:',
        'description': 'వివరణ:',
        'noPrediction': 'దిగుబడి అంచనా అందుబాటులో లేదు.',
        'baseYield': 'ప్రాథమిక దిగుబడి:',
        'predictedImprovement': 'అంచనా వేసిన మెరుగుదల',
        'contributingFactors': 'దోహదపడే కారకాలు:',
        'soilHealth': 'నేల ఆరోగ్యం',
        'fertilization': 'ఎరువు',
        'noSchedule': 'అప్లికేషన్ షెడ్యూల్ అందుబాటులో లేదు.',
        'fertilizerName': 'ఎరువు',
        'applicationMethod': 'పద్ధతి',
        'noCost': 'ఖర్చు విశ్లేషణ అందుబాటులో లేదు.',
        'totalCostLabel': 'మొత్తం ఎరువు ఖర్చు:',
        'costPerHectare': 'హెక్టారుకు ఖర్చు:',
        'unitCost': 'యూనిట్ ఖర్చు',
        'totalCost': 'మొత్తం ఖర్చు',
        'noTips': 'విద్యా చిట్కాలు అందుబాటులో లేవు.',
        'fetchWeather': 'దయచేసి ముందుగా వాతావరణ డేటాను పొందండి.',
        'nutrientRequirements': 'పోషకాల అవసరాలు',
        'growthStages': 'వృద్ధి దశలు'
    },
    'ta': {
        'title': 'ஸ்மார்ட் உர பரிந்துரை அமைப்பு',
        'selectLanguage': 'மொழியைத் தேர்ந்தெடுக்கவும்:',
        'inputDetails': 'உள்ளீட்டு விவரங்கள்',
        'cropType': 'பயிர் வகை:',
        'selectCrop': 'பயிரைத் தேர்ந்தெடுக்கவும்',
        'soilType': 'மண் வகை:',
        'selectSoil': 'மண் வகையைத் தேர்ந்தெடுக்கவும்',
        'region': 'பகுதி:',
        'selectRegion': 'பகுதியைத் தேர்ந்தெடுக்கவும்',
        'location': 'இடம் (வானிலைக்காக):',
        'getWeather': 'வானிலையைப் பெறுக',
        'soilTestResults': 'மண் பரிசோதனை முடிவுகள்',
        'soilPH': 'மண் pH:',
        'nitrogenLevel': 'நைட்ரஜன் அளவு (கிலோ/ஹெக்டேர்):',
        'phosphorusLevel': 'பாஸ்பரஸ் அளவு (கிலோ/ஹெக்டேர்):',
        'potassiumLevel': 'பொட்டாசியம் அளவு (கிலோ/ஹெக்டேர்):',
        'organicMatter': 'கரிம பொருள் (%):',
        'getRecommendation': 'உர பரிந்துரையைப் பெறுக',
        'resetForm': 'படிவத்தை மீட்டமைக்கவும்',
        'recommendation': 'பரிந்துரை',
        'schedule': 'பயன்பாட்டு அட்டவணை',
        'cost': 'செலவு பகுப்பாய்வு',
        'education': 'கல்வி',
        'cropInformation': 'பயிர் தகவல்',
        'weatherConditions': 'வானிலை நிலைமைகள்',
        'fertilizerRecommendation': 'உர பரிந்துரை',
        'yieldPrediction': 'விளைச்சல் கணிப்பு',
        'applicationSchedule': 'பயன்பாட்டு அட்டவணை',
        'costBreakdown': 'செலவு பகுப்பாய்வு',
        'educationalTips': 'கல்வி குறிப்புகள்',
        'footer': '© 2023 ஸ்மார்ட் உர பரிந்துரை அமைப்பு | நிலையான விவசாயத்திற்காக உருவாக்கப்பட்டது',
        'selectCropFirst': 'முதலில் பயிரைத் தேர்ந்தெடுக்கவும்.',
        'enterLocation': 'இடத்தை உள்ளிடவும்.',
        'fetchingWeather': 'வானிலை தரவைப் பெறுகிறது...',
        'weatherError': 'வானிலை தரவைப் பெறுவதில் பிழை. மீண்டும் முயற்சிக்கவும்.',
        'weatherRecommendations': 'வானிலை அடிப்படையிலான பரிந்துரைகள்:',
        'fillAllFields': 'அனைத்து தேவையான புலங்களையும் நிரப்பவும்.',
        'noRecommendation': 'பரிந்துரை எதுவும் இல்லை.',
        'quantity': 'அளவு:',
        'composition': 'கலவை:',
        'description': 'விளக்கம்:',
        'noPrediction': 'விளைச்சல் கணிப்பு எதுவும் இல்லை.',
        'baseYield': 'அடிப்படை விளைச்சல்:',
        'predictedImprovement': 'கணிக்கப்பட்ட மேம்பாடு',
        'contributingFactors': 'பங்களிக்கும் காரணிகள்:',
        'soilHealth': 'மண் ஆரோக்கியம்',
        'fertilization': 'உரமிடுதல்',
        'noSchedule': 'பயன்பாட்டு அட்டவணை எதுவும் இல்லை.',
        'fertilizerName': 'உரம்',
        'applicationMethod': 'முறை',
        'noCost': 'செலவு பகுப்பாய்வு எதுவும் இல்லை.',
        'totalCostLabel': 'மொத்த உர செலவு:',
        'costPerHectare': 'ஹெக்டேருக்கான செலவு:',
        'unitCost': 'அலகு செலவு',
        'totalCost': 'மொத்த செலவு',
        'noTips': 'கல்வி குறிப்புகள் எதுவும் இல்லை.',
        'fetchWeather': 'முதலில் வானிலை தரவைப் பெறவும்.',
        'nutrientRequirements': 'ஊட்டச்சத்து தேவைகள்',
        'growthStages': 'வளர்ச்சி நிலைகள்'
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Load preferred language from localStorage if available
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
        languageSelect.value = savedLanguage;
    }
    
    // Translate the page on load
    translatePage();
    
    // Initialize tooltips
    initTooltips();
});
