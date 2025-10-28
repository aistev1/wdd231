// Course data array
const courses = [
    { code: "CSE 110", name: "Programming Building Blocks", credits: 3, completed: true },
    { code: "WDD 130", name: "Web Fundamentals", credits: 3, completed: true },
    { code: "CSE 111", name: "Programming with Functions", credits: 3, completed: false },
    { code: "CSE 210", name: "Programming with Classes", credits: 3, completed: false },
    { code: "WDD 131", name: "Dynamic Web Fundamentals", credits: 3, completed: true },
    { code: "WDD 231", name: "Web Frontend Development I", credits: 3, completed: false }
];

function displayCourses(filter = 'all') {
    const courseCards = document.getElementById('course-cards');
    const totalCredits = document.getElementById('total-credits');
    
    let filteredCourses = courses;
    
    if (filter === 'wdd') {
        filteredCourses = courses.filter(course => course.code.startsWith('WDD'));
    } else if (filter === 'cse') {
        filteredCourses = courses.filter(course => course.code.startsWith('CSE'));
    }
    
    courseCards.innerHTML = '';
    
    filteredCourses.forEach(course => {
        const card = document.createElement('div');
        card.className = `course-card ${course.completed ? 'completed' : ''}`;
        card.innerHTML = `
            <h3>${course.code}</h3>
            <p>${course.name}</p>
            <p><strong>Credits:</strong> ${course.credits}</p>
            <p><strong>Status:</strong> ${course.completed ? '✅ Completed' : '⏳ In Progress'}</p>
        `;
        courseCards.appendChild(card);
    });
    
    // Calculate total credits
    const total = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
    totalCredits.textContent = total;
}

// Event listeners for filter buttons
document.getElementById('all-courses').addEventListener('click', () => displayCourses('all'));
document.getElementById('wdd-courses').addEventListener('click', () => displayCourses('wdd'));
document.getElementById('cse-courses').addEventListener('click', () => displayCourses('cse'));

// Initial display
displayCourses();