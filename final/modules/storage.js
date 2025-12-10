// Local Storage keys
const STORAGE_KEYS = {
    SAVED_BOOKS: 'pageturner_saved_books',
    USER_PREFS: 'pageturner_user_preferences',
    THEME: 'pageturner_theme'
};

// Save books to localStorage
export function saveBook(book) {
    try {
        const savedBooks = getSavedBooks();
        
        // Check if book already saved
        const exists = savedBooks.some(b => b.key === book.key);
        if (exists) {
            return { success: false, message: 'Book already saved' };
        }
        
        // Add new book
        savedBooks.push({
            key: book.key,
            title: book.title,
            author: book.authors?.[0]?.name || 'Unknown Author',
            cover_id: book.cover_id,
            savedAt: new Date().toISOString()
        });
        
        localStorage.setItem(STORAGE_KEYS.SAVED_BOOKS, JSON.stringify(savedBooks));
        return { success: true, message: 'Book saved successfully' };
        
    } catch (error) {
        console.error('Error saving book:', error);
        return { success: false, message: 'Error saving book' };
    }
}

// Remove book from saved
export function removeBook(bookKey) {
    try {
        const savedBooks = getSavedBooks();
        const filteredBooks = savedBooks.filter(book => book.key !== bookKey);
        
        localStorage.setItem(STORAGE_KEYS.SAVED_BOOKS, JSON.stringify(filteredBooks));
        return { success: true, message: 'Book removed successfully' };
        
    } catch (error) {
        console.error('Error removing book:', error);
        return { success: false, message: 'Error removing book' };
    }
}

// Get all saved books
export function getSavedBooks() {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.SAVED_BOOKS);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Error getting saved books:', error);
        return [];
    }
}

// Save user preferences
export function saveUserPreferences(preferences) {
    try {
        localStorage.setItem(STORAGE_KEYS.USER_PREFS, JSON.stringify(preferences));
        return { success: true, message: 'Preferences saved successfully' };
    } catch (error) {
        console.error('Error saving preferences:', error);
        return { success: false, message: 'Error saving preferences' };
    }
}

// Get user preferences
export function getUserPreferences() {
    try {
        const prefs = localStorage.getItem(STORAGE_KEYS.USER_PREFS);
        return prefs ? JSON.parse(prefs) : {};
    } catch (error) {
        console.error('Error getting preferences:', error);
        return {};
    }
}

// Save theme preference
export function saveTheme(theme) {
    try {
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
        document.documentElement.setAttribute('data-theme', theme);
        return { success: true, message: 'Theme saved successfully' };
    } catch (error) {
        console.error('Error saving theme:', error);
        return { success: false, message: 'Error saving theme' };
    }
}

// Get current theme
export function getCurrentTheme() {
    try {
        const theme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        return theme;
    } catch (error) {
        console.error('Error getting theme:', error);
        return 'light';
    }
}