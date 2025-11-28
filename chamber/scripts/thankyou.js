// URL parameter handling for thankyou.html
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);

    // Display all the submitted data
    document.getElementById("fname").textContent = params.get("fname") || "Not provided";
    document.getElementById("lname").textContent = params.get("lname") || "Not provided";
    document.getElementById("email").textContent = params.get("email") || "Not provided";
    document.getElementById("phone").textContent = params.get("phone") || "Not provided";
    document.getElementById("organization").textContent = params.get("organization") || "Not provided";
    document.getElementById("orgTitle").textContent = params.get("orgTitle") || "Not provided";

    // Format and display timestamp
    const timestamp = params.get("timestamp");
    if (timestamp) {
        const date = new Date(timestamp);
        document.getElementById("timestamp").textContent = date.toLocaleString();
    } else {
        document.getElementById("timestamp").textContent = "Not available";
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