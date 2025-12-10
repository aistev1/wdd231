// Import ES Modules
import { fetchBooks, getCoverUrl } from './modules/api.js';
import { 
    saveBook, 
    removeBook, 
    getSavedBooks, 
    saveUserPreferences, 
    getUserPreferences,
    saveTheme,
    getCurrentTheme 
} from './modules/storage.js';
import { showModal, closeModal, createBookModalContent } from './modules/modal.js';
import { 
    filterBooks, 
    sortBooks, 
    generateStats, 
    createBookCard,
    debounce 
} from './modules/utils.js';

// Global state
let allBooks = [];
let filteredBooks = [];
let currentFilters = {
    searchTerm: '',
    genre: '',
    availability: '',
    sortBy: 'title'
};

// DOM Elements
const domElements = {
    hamburger: document.querySelector('.hamburger'),
    navMenu: document.querySelector('.nav-menu'),
    bookCatalog: document.getElementById('book-catalog'),
    featuredBooks: document.getElementById('featured-books'),
    savedBooks: document.getElementById('saved-books'),
    emptySaved: document.getElementById('empty-saved'),
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),
    genreFilter: document.getElementById('genre-filter'),
    availabilityFilter: document.getElementById('availability-filter'),
    resetFilters: document.getElementById('reset-filters'),
    bookCount: document.getElementById('book-count'),
    gridView: document.getElementById('grid-view'),
    listView: document.getElementById('list-view'),
    favGenre: document.getElementById('fav-genre'),
    notifications: document.getElementById('notifications'),
    themeToggle: document.getElementById('theme'),
    savePreferences: document.getElementById('save-preferences'),
    prefStatus: document.getElementById('pref-status'),
    activityList: document.getElementById('activity-list'),
    stats: {
        totalBooks: document.getElementById('total-books'),
        activeMembers: document.getElementById('active-members'),
        booksExchanged: document.getElementById('books-exchanged'),
        discussions: document.getElementById('discussions')
    }
};

// Initialize the application
async function init() {
    console.log('Initializing PageTurner Community...');
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Initialize theme
    getCurrentTheme();
    
    // Setup navigation
    setupNavigation();
    
    // Load books and setup catalog if on catalog page
    if (domElements.bookCatalog) {
        await loadBooks();
        setupCatalog();
    }
    
    // Setup featured books on home page
    if (domElements.featuredBooks) {
        await setupFeaturedBooks();
        setupStats();
    }
    
    // Setup forum page
    if (domElements.favGenre) {
        setupForum();
    }
    
    // Setup modal
    setupModal();
    
    // Load saved books
    loadSavedBooks();
    
    console.log('Application initialized successfully');
}

// Setup navigation
function setupNavigation() {
    if (!domElements.hamburger || !domElements.navMenu) return;
    
    domElements.hamburger.addEventListener('click', () => {
        domElements.navMenu.classList.toggle('active');
        domElements.hamburger.setAttribute(
            'aria-expanded', 
            domElements.navMenu.classList.contains('active')
        );
    });
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            domElements.navMenu.classList.remove('active');
            domElements.hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

// Load books from API
async function loadBooks() {
    try {
        console.log('Loading books...');
        allBooks = await fetchBooks();
        filteredBooks = [...allBooks];
        
        console.log(`Loaded ${allBooks.length} books`);
        displayBooks(allBooks);
        updateBookCount(allBooks.length);
        
    } catch (error) {
        console.error('Error loading books:', error);
        domElements.bookCatalog.innerHTML = `
            <div class="error-message">
                <p>Sorry, we couldn't load the books. Please try again later.</p>
                <button class="btn-primary" onclick="location.reload()">Retry</button>
            </div>
        `;
    }
}

// Display books in catalog
function displayBooks(books) {
    if (!domElements.bookCatalog) return;
    
    if (books.length === 0) {
        domElements.bookCatalog.innerHTML = `
            <div class="no-results">
                <p>No books found matching your criteria.</p>
                <button class="btn-secondary" id="clear-filters">Clear Filters</button>
            </div>
        `;
        
        document.getElementById('clear-filters')?.addEventListener('click', resetAllFilters);
        return;
    }
    
    // Using array method: map to transform books to HTML
    const booksHTML = books.map(book => createBookCard(book)).join('');
    domElements.bookCatalog.innerHTML = booksHTML;
    
    // Add event listeners to book cards
    setupBookCardListeners();
}

// Setup catalog functionality
function setupCatalog() {
    if (!domElements.searchInput) return;
    
    // Search functionality with debounce
    const debouncedSearch = debounce(() => {
        currentFilters.searchTerm = domElements.searchInput.value;
        applyFilters();
    }, 300);
    
    domElements.searchInput.addEventListener('input', debouncedSearch);
    domElements.searchBtn?.addEventListener('click', () => {
        currentFilters.searchTerm = domElements.searchInput.value;
        applyFilters();
    });
    
    // Genre filter
    domElements.genreFilter?.addEventListener('change', (e) => {
        currentFilters.genre = e.target.value;
        applyFilters();
    });
    
    // Availability filter
    domElements.availabilityFilter?.addEventListener('change', (e) => {
        currentFilters.availability = e.target.value;
        applyFilters();
    });
    
    // Reset filters
    domElements.resetFilters?.addEventListener('click', resetAllFilters);
    
    // View controls
    domElements.gridView?.addEventListener('click', () => {
        setViewMode('grid');
    });
    
    domElements.listView?.addEventListener('click', () => {
        setViewMode('list');
    });
}

// Apply filters to books
function applyFilters() {
    filteredBooks = filterBooks(allBooks, currentFilters);
    displayBooks(filteredBooks);
    updateBookCount(filteredBooks.length);
}

// Reset all filters
function resetAllFilters() {
    currentFilters = {
        searchTerm: '',
        genre: '',
        availability: '',
        sortBy: 'title'
    };
    
    if (domElements.searchInput) domElements.searchInput.value = '';
    if (domElements.genreFilter) domElements.genreFilter.value = '';
    if (domElements.availabilityFilter) domElements.availabilityFilter.value = '';
    
    filteredBooks = [...allBooks];
    displayBooks(filteredBooks);
    updateBookCount(filteredBooks.length);
}

// Update book count display
function updateBookCount(count) {
    if (!domElements.bookCount) return;
    domElements.bookCount.textContent = `Showing ${count} books`;
}

// Set view mode (grid/list)
function setViewMode(mode) {
    const catalog = domElements.bookCatalog;
    if (!catalog) return;
    
    catalog.className = mode === 'grid' ? 'books-grid catalog-view' : 'books-list catalog-view';
    
    if (domElements.gridView && domElements.listView) {
        domElements.gridView.classList.toggle('active', mode === 'grid');
        domElements.listView.classList.toggle('active', mode === 'list');
    }
}

// Setup featured books on home page
async function setupFeaturedBooks() {
    try {
        const books = await fetchBooks();
        const featured = books.slice(0, 6); // Show 6 featured books
        
        // Using array method: slice to get first 6 books
        const featuredHTML = featured.map(book => createBookCard(book)).join('');
        domElements.featuredBooks.innerHTML = featuredHTML;
        
        // Add event listeners to featured books
        setupBookCardListeners();
        
    } catch (error) {
        console.error('Error setting up featured books:', error);
        domElements.featuredBooks.innerHTML = `
            <div class="error-message">
                <p>Unable to load featured books.</p>
            </div>
        `;
    }
}

// Setup stats on home page
function setupStats() {
    const stats = generateStats();
    
    // Animate counting up
    Object.keys(stats).forEach((key, index) => {
        if (!domElements.stats[key]) return;
        
        const target = stats[key];
        const element = domElements.stats[key];
        const duration = 2000;
        const step = target / (duration / 16); // 60fps
        
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    });
}

// Setup forum functionality
function setupForum() {
    // Load saved preferences
    const prefs = getUserPreferences();
    if (domElements.favGenre && prefs.favoriteGenre) {
        domElements.favGenre.value = prefs.favoriteGenre;
    }
    if (domElements.notifications && prefs.notifications !== undefined) {
        domElements.notifications.checked = prefs.notifications;
    }
    if (domElements.themeToggle) {
        const currentTheme = getCurrentTheme();
        domElements.themeToggle.checked = currentTheme === 'dark';
    }
    
    // Save preferences
    domElements.savePreferences?.addEventListener('click', () => {
        const preferences = {
            favoriteGenre: domElements.favGenre?.value || '',
            notifications: domElements.notifications?.checked || false,
            theme: domElements.themeToggle?.checked ? 'dark' : 'light'
        };
        
        const result = saveUserPreferences(preferences);
        domElements.prefStatus.textContent = result.message;
        domElements.prefStatus.className = `pref-status ${result.success ? 'success' : 'error'}`;
        
        // Apply theme if changed
        if (preferences.theme) {
            saveTheme(preferences.theme);
        }
        
        // Clear status message after 3 seconds
        setTimeout(() => {
            domElements.prefStatus.textContent = '';
        }, 3000);
    });
    
    // Setup activity list
    setupActivityList();
}

// Setup activity list
function setupActivityList() {
    const activities = [
        'Sarah Johnson started discussion: "Best Mystery Novels"',
        'Michael Chen added 3 new books to exchange',
        'Book Club: December pick announced',
        'Emily Rodriguez successfully exchanged "The Great Gatsby"',
        'New member: Alex Thompson joined the community'
    ];
    
    // Using array method: forEach to add activities
    activities.forEach((activity, index) => {
        const li = document.createElement('li');
        li.textContent = activity;
        li.setAttribute('data-index', index);
        domElements.activityList.appendChild(li);
    });
}

// Setup book card event listeners
function setupBookCardListeners() {
    // View details buttons
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', async (e) => {
            const bookCard = e.target.closest('.book-card');
            const bookKey = bookCard?.dataset.key;
            
            if (bookKey) {
                const book = allBooks.find(b => b.key === bookKey);
                if (book) {
                    const modalContent = createBookModalContent(book);
                    showModal(modalContent, book.title);
                }
            }
        });
    });
    
    // Save book buttons
    document.querySelectorAll('.save-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const bookId = e.currentTarget.dataset.bookId;
            const book = allBooks.find(b => b.key === bookId);
            
            if (book) {
                const result = saveBook(book);
                alert(result.message);
                
                if (result.success) {
                    e.currentTarget.innerHTML = '<i class="fas fa-check"></i>';
                    e.currentTarget.disabled = true;
                    loadSavedBooks();
                }
            }
        });
    });
}

// Load saved books from localStorage
function loadSavedBooks() {
    const savedBooks = getSavedBooks();
    const savedBooksContainer = domElements.savedBooks;
    const emptyMessage = domElements.emptySaved;
    
    if (!savedBooksContainer || !emptyMessage) return;
    
    if (savedBooks.length === 0) {
        emptyMessage.style.display = 'block';
        savedBooksContainer.innerHTML = '';
        return;
    }
    
    emptyMessage.style.display = 'none';
    
    // Using array method: forEach to create saved books display
    const savedBooksHTML = savedBooks.map(book => `
        <div class="saved-book-item">
            <img src="https://covers.openlibrary.org/b/id/${book.cover_id}-S.jpg" 
                 alt="${book.title}" loading="lazy">
            <div class="saved-book-info">
                <h4>${book.title}</h4>
                <p>${book.author}</p>
                <button class="btn-secondary remove-saved" 
                        data-book-key="${book.key}"
                        aria-label="Remove ${book.title} from saved">
                    Remove
                </button>
            </div>
        </div>
    `).join('');
    
    savedBooksContainer.innerHTML = savedBooksHTML;
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-saved').forEach(button => {
        button.addEventListener('click', (e) => {
            const bookKey = e.currentTarget.dataset.bookKey;
            const result = removeBook(bookKey);
            alert(result.message);
            
            if (result.success) {
                loadSavedBooks();
            }
        });
    });
}

// Setup modal functionality
function setupModal() {
    // Close modal buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('close-modal') || 
            e.target.classList.contains('close-modal-btn')) {
            closeModal();
        }
    });
    
    // Save book from modal
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('save-book-btn')) {
            const bookId = e.target.dataset.bookId;
            const book = allBooks.find(b => b.key === bookId);
            
            if (book) {
                const result = saveBook(book);
                alert(result.message);
                
                if (result.success) {
                    loadSavedBooks();
                    closeModal();
                }
            }
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Export for testing/debugging
window.PageTurner = {
    init,
    loadBooks,
    saveBook,
    removeBook,
    getSavedBooks,
    showModal,
    closeModal
};