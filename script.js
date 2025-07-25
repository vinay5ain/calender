// Show current date
function showCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = now.toLocaleDateString(undefined, options);
}

// Determine season based on current month
function getSeason(date) {
    const month = date.getMonth() + 1;
    if (month >= 3 && month <= 5) return 'Spring';
    if (month >= 6 && month <= 8) return 'Summer';
    if (month >= 9 && month <= 11) return 'Autumn';
    return 'Winter';
}

function showSeason() {
    const now = new Date();
    document.getElementById('season').textContent = `Season: ${getSeason(now)}`;
}

// Calendar rendering
function renderCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const today = now.getDate();
    // Days of week
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.textContent = day;
        calendar.appendChild(dayDiv);
    });
    // Empty slots before first day
    for (let i = 0; i < startDay; i++) {
        const emptyDiv = document.createElement('div');
        calendar.appendChild(emptyDiv);
    }
    // Dates
    for (let date = 1; date <= daysInMonth; date++) {
        const dateDiv = document.createElement('div');
        dateDiv.className = 'date';
        dateDiv.textContent = date;
        if (date === today) {
            dateDiv.classList.add('today');
        }
        const eventKey = getEventKey(year, month, date);
        if (localStorage.getItem(eventKey)) {
            dateDiv.classList.add('has-event');
            dateDiv.title = localStorage.getItem(eventKey);
        }
        calendar.appendChild(dateDiv);
    }
}

// Event handling
function getEventKey(year, month, date) {
    return `event-${year}-${month + 1}-${date}`;
}

function addEvent(e) {
    e.preventDefault();
    const dateValue = document.getElementById('event-date').value;
    const title = document.getElementById('event-title').value.trim();
    if (!dateValue || !title) return;
    const dateObj = new Date(dateValue);
    const key = getEventKey(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    localStorage.setItem(key, title);
    renderCalendar();
    showEvents();
    document.getElementById('event-form').reset();
}

function showEvents() {
    const eventList = document.getElementById('event-list');
    eventList.innerHTML = '';
    // Show events for current month
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    for (let date = 1; date <= 31; date++) {
        const key = getEventKey(year, month, date);
        const event = localStorage.getItem(key);
        if (event) {
            const li = document.createElement('li');
            li.textContent = `${year}-${String(month+1).padStart(2,'0')}-${String(date).padStart(2,'0')}: ${event}`;
            eventList.appendChild(li);
        }
    }
}

document.getElementById('event-form').addEventListener('submit', addEvent);

// Initial load
showCurrentDate();
showSeason();
renderCalendar();
showEvents();
// Optional: update current date and season at midnight
setInterval(() => {
    showCurrentDate();
    showSeason();
}, 60 * 1000); 