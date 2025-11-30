import attractions from '../data/attractions.mjs';

// DOM elements
const attractionsContainer = document.getElementById('attractionsContainer');
const visitMessage = document.getElementById('visitMessage');
const visitorMessage = document.getElementById('visitorMessage');
const closeMessage = document.getElementById('closeMessage');

// Display attractions from JSON data
function displayAttractions() {
    console.log('Attractions data loaded:', attractions); // Debug
    
    if (!attractionsContainer) {
        console.error('attractionsContainer not found!');
        return;
    }
    
    attractionsContainer.innerHTML = '';
    
    attractions.forEach((attraction, index) => {
        const card = document.createElement('article');
        card.className = 'attraction-card';
        card.setAttribute('data-card', `card${index + 1}`);
        
        card.innerHTML = `
            <h2>${attraction.name}</h2>
            <figure>
                <img src="${attraction.image}" alt="${attraction.name}" loading="lazy" width="300" height="200">
            </figure>
            <address>${attraction.address}</address>
            <p>${attraction.description}</p>
            <button class="learn-more">Learn More</button>
        `;
        
        attractionsContainer.appendChild(card);
    });
}

// Handle visit message with localStorage
function displayVisitMessage() {
    const lastVisit = localStorage.getItem('lastVisit');
    const currentTime = Date.now();
    
    if (!lastVisit) {
        visitMessage.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const lastVisitTime = parseInt(lastVisit);
        const timeDifference = currentTime - lastVisitTime;
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        
        if (daysDifference < 1) {
            visitMessage.textContent = "Back so soon! Awesome!";
        } else if (daysDifference === 1) {
            visitMessage.textContent = `You last visited ${daysDifference} day ago.`;
        } else {
            visitMessage.textContent = `You last visited ${daysDifference} days ago.`;
        }
    }
    
    localStorage.setItem('lastVisit', currentTime.toString());
}

// Close message functionality
if (closeMessage) {
    closeMessage.addEventListener('click', () => {
        visitorMessage.style.display = 'none';
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Discover page loaded');
    displayAttractions();
    displayVisitMessage();
});