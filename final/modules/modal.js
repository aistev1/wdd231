// Modal functionality
let currentModal = null;

// Create and show modal
export function showModal(content, title = 'Book Details') {
    const modal = document.getElementById('book-modal');
    const modalContent = document.getElementById('modal-content');
    
    if (!modal || !modalContent) {
        console.error('Modal elements not found');
        return;
    }
    
    modalContent.innerHTML = content;
    currentModal = modal;
    
    // Show modal
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    
    // Trap focus inside modal
    trapFocus(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', closeOnOutsideClick);
    
    // Add escape key listener
    document.addEventListener('keydown', handleEscapeKey);
}

// Close modal
export function closeModal() {
    if (currentModal) {
        currentModal.style.display = 'none';
        currentModal.setAttribute('aria-hidden', 'true');
        
        // Remove event listeners
        currentModal.removeEventListener('click', closeOnOutsideClick);
        document.removeEventListener('keydown', handleEscapeKey);
        
        currentModal = null;
    }
}

// Close modal when clicking outside content
function closeOnOutsideClick(event) {
    if (event.target === currentModal) {
        closeModal();
    }
}

// Handle escape key
function handleEscapeKey(event) {
    if (event.key === 'Escape' && currentModal) {
        closeModal();
    }
}

// Trap focus inside modal for accessibility
function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        firstElement.focus();
        
        modal.addEventListener('keydown', (event) => {
            if (event.key !== 'Tab') return;
            
            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
}

// Create book detail modal content
export function createBookModalContent(book) {
    return `
        <div class="modal-book-details">
            <div class="modal-book-cover">
                <img src="https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg" 
                     alt="${book.title}" loading="lazy">
            </div>
            <div class="modal-book-info">
                <h2>${book.title}</h2>
                <p class="modal-author"><strong>Author:</strong> ${book.authors?.[0]?.name || 'Unknown'}</p>
                <p class="modal-year"><strong>Published:</strong> ${book.first_publish_year || 'Unknown'}</p>
                <p class="modal-genre"><strong>Genre:</strong> ${book.subject?.join(', ') || 'Fiction'}</p>
                <p class="modal-availability ${book.available ? 'available' : 'unavailable'}">
                    <strong>Status:</strong> ${book.available ? 'Available for Exchange' : 'Currently Reserved'}
                </p>
                <div class="modal-actions">
                    <button class="btn-primary save-book-btn" data-book-id="${book.key}">
                        <i class="fas fa-bookmark"></i> Save Book
                    </button>
                    <button class="btn-secondary close-modal-btn">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;
}