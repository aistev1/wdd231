// API configuration
const API_BASE = 'https://openlibrary.org';
const SUBJECT = 'fiction';
const LIMIT = 15;

// Fallback local data in case API fails
const fallbackBooks = [
    {
        key: '/works/OL82592W',
        title: 'The Great Gatsby',
        authors: [{ name: 'F. Scott Fitzgerald' }],
        first_publish_year: 1925,
        subject: ['Fiction', 'Classic', 'American Literature'],
        cover_id: 297249,
        available: true
    },
    {
        key: '/works/OL82579W',
        title: 'To Kill a Mockingbird',
        authors: [{ name: 'Harper Lee' }],
        first_publish_year: 1960,
        subject: ['Fiction', 'Southern Gothic', 'Coming-of-age'],
        cover_id: 297247,
        available: true
    },
    // Add 13 more books...
];

// Fetch books from Open Library API
export async function fetchBooks() {
    try {
        console.log('Fetching books from API...');
        const response = await fetch(`${API_BASE}/subjects/${SUBJECT}.json?limit=${LIMIT}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response received:', data);
        
        // Process and return books
        const books = data.works?.map(work => ({
            key: work.key,
            title: work.title,
            authors: work.authors || [],
            first_publish_year: work.first_publish_year,
            subject: work.subject?.slice(0, 3) || ['Fiction'],
            cover_id: work.cover_id,
            available: Math.random() > 0.3 // Random availability
        })) || [];
        
        return books.length > 0 ? books : fallbackBooks;
        
    } catch (error) {
        console.error('Error fetching from API, using fallback data:', error);
        return fallbackBooks;
    }
}

// Fetch a single book by ID
export async function fetchBookById(bookId) {
    try {
        const response = await fetch(`${API_BASE}${bookId}.json`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return {
            ...data,
            cover_url: data.covers?.[0] 
                ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`
                : 'https://via.placeholder.com/300x450?text=No+Cover'
        };
        
    } catch (error) {
        console.error('Error fetching book details:', error);
        return null;
    }
}

// Get cover image URL
export function getCoverUrl(coverId, size = 'M') {
    if (!coverId) return 'https://via.placeholder.com/300x450?text=No+Cover';
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}sss