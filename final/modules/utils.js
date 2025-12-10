// Utility functions

// Format date
export function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Debounce function for search
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Filter books based on criteria
export function filterBooks(books, filters) {
    return books.filter(book => {
        // Search term filter
        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            const titleMatch = book.title.toLowerCase().includes(searchLower);
            const authorMatch = book.authors?.some(author => 
                author.name.toLowerCase().includes(searchLower)
            );
            if (!titleMatch && !authorMatch) return false;
        }
        
        // Genre filter
        if (filters.genre && filters.genre !== '') {
            const bookGenres = book.subject?.map(g => g.toLowerCase()) || [];
            if (!bookGenres.includes(filters.genre.toLowerCase())) {
                return false;
            }
        }
        
        // Availability filter
        if (filters.availability && filters.availability !== '') {
            if (filters.availability === 'available' && !book.available) return false;
            if (filters.availability === 'reserved' && book.available) return false;
        }
        
        return true;
    });
}

// Sort books
export function sortBooks(books, sortBy) {
    const booksCopy = [...books];
    
    switch (sortBy) {
        case 'title':
            return booksCopy.sort((a, b) => a.title.localeCompare(b.title));
        case 'author':
            return booksCopy.sort((a, b) => {
                const authorA = a.authors?.[0]?.name || '';
                const authorB = b.authors?.[0]?.name || '';
                return authorA.localeCompare(authorB);
            });
        case 'year':
            return booksCopy.sort((a, b) => 
                (b.first_publish_year || 0) - (a.first_publish_year || 0)
            );
        default:
            return booksCopy;
    }
}

// Generate random stats for demo
export function generateStats() {
    return {
        totalBooks: Math.floor(Math.random() * 500) + 300,
        activeMembers: Math.floor(Math.random() * 200) + 150,
        booksExchanged: Math.floor(Math.random() * 1000) + 800,
        discussions: Math.floor(Math.random() * 100) + 50
    };
}

// Create book card HTML
export function createBookCard(book) {
    return `
        <article class="book-card" data-key="${book.key}">
            <img src="https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg" 
                 alt="${book.title}" 
                 class="book-cover" 
                 loading="lazy">
            <div class="book-info">
                <h3>${book.title}</h3>
                <p class="book-author">${book.authors?.[0]?.name || 'Unknown Author'}</p>
                <div class="book-meta">
                    <span class="book-year">${book.first_publish_year || 'Unknown Year'}</span>
                    <span class="book-availability ${book.available ? 'available' : 'reserved'}">
                        ${book.available ? 'Available' : 'Reserved'}
                    </span>
                </div>
                <div class="book-actions">
                    <button class="btn-secondary view-details" 
                            aria-label="View details for ${book.title}">
                        View Details
                    </button>
                    <button class="save-btn" 
                            aria-label="Save ${book.title} to your list"
                            data-book-id="${book.key}">
                        <i class="fas fa-bookmark"></i>
                    </button>
                </div>
            </div>
        </article>
    `;
}