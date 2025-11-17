const currentYearSpan = document.getElementById('currentyear');
const lastModifiedSpan = document.getElementById('lastmodified');
const menuButton = document.getElementById('menu-button');
const navigation = document.getElementById('navigation');
const gridViewButton = document.getElementById('grid-view');
const listViewButton = document.getElementById('list-view');
const memberCardsContainer = document.getElementById('member-cards');

currentYearSpan.textContent = new Date().getFullYear();
lastModifiedSpan.textContent = document.lastModified;

menuButton.addEventListener('click', () => {
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', !isExpanded);
    navigation.classList.toggle('active');
});

document.addEventListener('click', (event) => {
    if (!event.target.closest('.main-nav') && navigation.classList.contains('active')) {
        navigation.classList.remove('active');
        menuButton.setAttribute('aria-expanded', 'false');
    }
});

function setActiveView(activeButton, inactiveButton, viewClass) {
    memberCardsContainer.classList.remove('grid-view', 'list-view');
    memberCardsContainer.classList.add(viewClass);
    activeButton.classList.add('active');
    activeButton.setAttribute('aria-pressed', 'true');
    inactiveButton.classList.remove('active');
    inactiveButton.setAttribute('aria-pressed', 'false');
}

gridViewButton.addEventListener('click', () => {
    setActiveView(gridViewButton, listViewButton, 'grid-view');
});

listViewButton.addEventListener('click', () => {
    setActiveView(listViewButton, gridViewButton, 'list-view');
});

async function loadMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const members = await response.json();
        displayMembers(members);
    } catch (error) {
        console.error('Error loading member data:', error);
        memberCardsContainer.innerHTML = `
            <div class="error-message">
                <h3>Unable to Load Directory</h3>
                <p>We're having trouble loading the business directory. Please try again later.</p>
                <button onclick="loadMembers()" class="retry-btn">Retry</button>
            </div>
        `;
    }
}

function displayMembers(members) {
    memberCardsContainer.innerHTML = '';
    
    members.forEach(member => {
        const card = document.createElement('article');
        card.className = 'member-card';
        card.setAttribute('data-member-level', member.membershipLevel);
        
        const membershipLevels = {
            1: { class: 'member-level-1', text: 'Member' },
            2: { class: 'member-level-2', text: 'Silver' },
            3: { class: 'member-level-3', text: 'Gold' }
        };
        
        const membership = membershipLevels[member.membershipLevel] || membershipLevels[1];
        
        card.innerHTML = `
            <div class="membership-badge ${membership.class}">${membership.text}</div>
            <img src="images/${member.image}" alt="${member.name}" class="member-image" loading="lazy">
            <div class="member-details">
                <h3>${member.name}</h3>
                <div class="member-info">
                    <p><strong>📍</strong> ${member.address}</p>
                    <p><strong>📞</strong> ${member.phone}</p>
                    ${member.email ? `<p><strong>✉️</strong> ${member.email}</p>` : ''}
                    ${member.hours ? `<p><strong>🕒</strong> ${member.hours}</p>` : ''}
                </div>
                ${member.description ? `<p class="member-description">${member.description}</p>` : ''}
                <a href="${member.website}" target="_blank" rel="noopener" class="member-website">
                    Visit Website
                </a>
            </div>
        `;
        
        memberCardsContainer.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadMembers();
});

document.addEventListener('error', (event) => {
    if (event.target.tagName === 'IMG') {
        event.target.src = 'images/placeholder-business.jpg';
        event.target.alt = 'Image not available';
    }
}, true);




// Weather API Configuration
    const WEATHER_API_KEY = '080909663a832aab4c32585250af0328'; // You'll need to get this from OpenWeatherMap
    const CITY = 'Jinja'; // Replace with your actual city
    const COUNTRY_CODE = 'UG'; // Replace with your country code

    // DOM Elements
    const currentWeatherEl = document.getElementById('current-weather');
    const weatherForecastEl = document.getElementById('weather-forecast');

    // Fetch current weather
    async function fetchCurrentWeather() {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY_CODE}&units=metric&appid=${WEATHER_API_KEY}`
            );
            
            if (!response.ok) {
                throw new Error('Weather data not available');
            }
            
            const data = await response.json();
            displayCurrentWeather(data);
        } catch (error) {
            console.error('Error fetching current weather:', error);
            currentWeatherEl.innerHTML = '<div class="error">Unable to load weather data</div>';
        }
    }

    // Fetch weather forecast
    async function fetchWeatherForecast() {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${CITY},${COUNTRY_CODE}&units=metric&appid=${WEATHER_API_KEY}`
            );
            
            if (!response.ok) {
                throw new Error('Forecast data not available');
            }
            
            const data = await response.json();
            displayWeatherForecast(data);
        } catch (error) {
            console.error('Error fetching forecast:', error);
            weatherForecastEl.innerHTML = '<div class="error">Unable to load forecast</div>';
        }
    }

    // Display current weather
    function displayCurrentWeather(data) {
        const { main, weather, wind, name } = data;
        
        currentWeatherEl.innerHTML = `
            <div class="current-weather-info">
                <div class="temperature">${Math.round(main.temp)}°C</div>
                <img class="weather-icon" src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}">
            </div>
            <div class="weather-description">${weather[0].description}</div>
            <div class="weather-details">
                <div class="weather-detail">
                    <span>Feels like</span>
                    <strong>${Math.round(main.feels_like)}°C</strong>
                </div>
                <div class="weather-detail">
                    <span>Humidity</span>
                    <strong>${main.humidity}%</strong>
                </div>
                <div class="weather-detail">
                    <span>Wind</span>
                    <strong>${Math.round(wind.speed)} m/s</strong>
                </div>
                <div class="weather-detail">
                    <span>Pressure</span>
                    <strong>${main.pressure} hPa</strong>
                </div>
            </div>
        `;
    }

    // Display weather forecast
    function displayWeatherForecast(data) {
        // Get forecast for next 3 days (using midday forecasts for consistency)
        const forecasts = data.list.filter(item => 
            item.dt_txt.includes('12:00:00')
        ).slice(0, 3);

        weatherForecastEl.innerHTML = forecasts.map(forecast => {
            const date = new Date(forecast.dt * 1000);
            const dayName = date.toLocaleDateString('en', { weekday: 'short' });
            const monthDay = date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
            
            return `
                <div class="forecast-day">
                    <div class="forecast-date">
                        <div>${dayName}</div>
                        <div>${monthDay}</div>
                    </div>
                    <img class="forecast-icon" src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
                    <div class="forecast-temp">${Math.round(forecast.main.temp)}°C</div>
                    <div class="forecast-desc">${forecast.weather[0].description}</div>
                </div>
            `;
        }).join('');
    }

    // Initialize weather data when page loads
    document.addEventListener('DOMContentLoaded', function() {
        fetchCurrentWeather();
        fetchWeatherForecast();
        
        // Refresh weather data every 30 minutes
        setInterval(() => {
            fetchCurrentWeather();
            fetchWeatherForecast();
        }, 30 * 60 * 1000);
    });