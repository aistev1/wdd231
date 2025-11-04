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