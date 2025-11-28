// Modal functions
function openModal(id) {
    document.getElementById(id).showModal();
}

function closeModal(id) {
    document.getElementById(id).close();
}

// Set timestamp when form loads
document.addEventListener("DOMContentLoaded", () => {
    const timestampField = document.getElementById("timestamp");
    if (timestampField) {
        timestampField.value = new Date().toISOString();
        console.log("Timestamp set to:", timestampField.value); // For debugging
    }
    
    // Update footer information
    const currentYear = document.getElementById('currentyear');
    const lastModified = document.getElementById('lastmodified');
    
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    if (lastModified) {
        lastModified.textContent = document.lastModified;
    }
});