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
    const CITY = 'London'; // Replace with your actual city
    const COUNTRY_CODE = 'UK'; // Replace with your country code

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




    // Spotlights functionality - fetches from your existing JSON file
class MemberSpotlights {
    constructor() {
        this.members = [];
        this.spotlightsContainer = document.getElementById('spotlights-container');
        this.jsonUrl = 'data/members.json'; // Path to your existing JSON file
    }

    // Fetch members data from JSON file
    async fetchMembers() {
        try {
            console.log('Fetching member data from:', this.jsonUrl);
            const response = await fetch(this.jsonUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.members = data;
            console.log('Members data loaded:', this.members.length, 'members');
            
            return true;
        } catch (error) {
            console.error('Error fetching members:', error);
            this.showError('Unable to load member data');
            return false;
        }
    }

    // Filter and get random gold/silver members (membershipLevel 2 or 3)
    getRandomSpotlights() {
        const qualifiedMembers = this.members.filter(member => 
            member.membershipLevel === 2 || member.membershipLevel === 3
        );
        
        console.log('Qualified gold/silver members:', qualifiedMembers.length);
        
        if (qualifiedMembers.length === 0) {
            return [];
        }
        
        // Shuffle array and pick 2-3 members
        const shuffled = [...qualifiedMembers].sort(() => 0.5 - Math.random());
        const count = Math.min(shuffled.length, Math.floor(Math.random() * 2) + 2); // 2 or 3
        
        console.log('Selected', count, 'spotlight members');
        return shuffled.slice(0, count);
    }

    // Get membership level name
    getMembershipLevelName(level) {
        const levels = {
            1: 'Bronze',
            2: 'Silver', 
            3: 'Gold'
        };
        return levels[level] || 'Member';
    }

    // Get membership level class
    getMembershipLevelClass(level) {
        const classes = {
            1: 'bronze',
            2: 'silver',
            3: 'gold'
        };
        return classes[level] || 'member';
    }

    // Display spotlights
    displaySpotlights() {
        const spotlights = this.getRandomSpotlights();
        
        if (spotlights.length === 0) {
            this.showError('No featured members available');
            return;
        }

        const spotlightHTML = spotlights.map(member => this.createSpotlightCard(member)).join('');
        this.spotlightsContainer.innerHTML = spotlightHTML;
    }

    // Create individual spotlight card
    createSpotlightCard(member) {
        const membershipName = this.getMembershipLevelName(member.membershipLevel);
        const membershipClass = this.getMembershipLevelClass(member.membershipLevel);
        
        return `
            <div class="spotlight-card ${membershipClass}">
                <div class="membership-badge">${membershipName}</div>
                
                <div class="spotlight-header">
                    <img src="images/${member.image}" alt="${member.name} Logo" class="spotlight-logo" 
                         onerror="this.src='images/placeholder-business.jpg'">
                    <div class="spotlight-title">
                        <h3>${member.name}</h3>
                        <p class="spotlight-description">${member.description}</p>
                    </div>
                </div>
                
                <div class="spotlight-details">
                    <div class="detail-item">
                        <span class="detail-icon">📍</span>
                        <div class="detail-content">
                            <div class="detail-label">Address</div>
                            <div class="detail-value">${member.address}</div>
                        </div>
                    </div>
                    
                    <div class="detail-item">
                        <span class="detail-icon">📞</span>
                        <div class="detail-content">
                            <div class="detail-label">Phone</div>
                            <div class="detail-value">${member.phone}</div>
                        </div>
                    </div>
                    
                    <div class="detail-item">
                        <span class="detail-icon">✉️</span>
                        <div class="detail-content">
                            <div class="detail-label">Email</div>
                            <div class="detail-value">${member.email}</div>
                        </div>
                    </div>
                    
                    <div class="detail-item">
                        <span class="detail-icon">🌐</span>
                        <div class="detail-content">
                            <div class="detail-label">Website</div>
                            <a href="${member.website}" target="_blank" class="website-link">
                                Visit Website ↗
                            </a>
                        </div>
                    </div>
                    
                    <div class="detail-item">
                        <span class="detail-icon">🕒</span>
                        <div class="detail-content">
                            <div class="detail-label">Business Hours</div>
                            <div class="detail-value">${member.hours}</div>
                        </div>
                    </div>
                    
                    <div class="detail-item">
                        <span class="detail-icon">⭐</span>
                        <div class="detail-content">
                            <div class="detail-label">Membership</div>
                            <div class="detail-value">${membershipName} Member</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Show error message
    showError(message) {
        this.spotlightsContainer.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
            </div>
        `;
    }

    // Initialize spotlights
    async init() {
        const success = await this.fetchMembers();
        if (success) {
            this.displaySpotlights();
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', async () => {
    const spotlights = new MemberSpotlights();
    await spotlights.init();
});
// document.getElementById("timestamp").value = new Date().toISOString();

//     function openModal(id) {
//         document.getElementById(id).showModal();
//     }
//     function closeModal(id) {
//         document.getElementById(id).close();
//     }

// const params = new URLSearchParams(window.location.search);

// document.getElementById("fname").textContent = params.get("fname");
// document.getElementById("lname").textContent = params.get("lname");
// document.getElementById("email").textContent = params.get("email");
// document.getElementById("phone").textContent = params.get("phone");
// document.getElementById("organization").textContent = params.get("organization");
// document.getElementById("timestamp").textContent = params.get("timestamp");
// document.getElementById("orgTitle").textContent = params.get("orgTitle");

// document.addEventListener("DOMContentLoaded", () => {
//     const timestampField = document.getElementById("timestamp");
//     if (timestampField) {
//         timestampField.value = new Date().toISOString();
//     }
// });