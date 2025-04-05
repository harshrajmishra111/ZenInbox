// Sample task data (replace with API calls in production)
const tasks = {
    '2023-11-05': [
        { id: 1, title: 'Assignment 2 Due', description: 'Assignment 2 is due on November 6 at 11:59pm', due: 'Due in 5 days' }
    ],
    '2023-11-08': [
        { id: 2, title: 'Midterm 2', description: 'Midterm 2 will be on November 8 from 7-9pm', due: 'November 8, 2023' }
    ]
};

// Calendar state
let currentMonth = 11; // November (1-based)
let currentYear = 2023;

document.addEventListener('DOMContentLoaded', () => {
    const calendarGrid = document.querySelector('.calendar-grid');
    const tasksContainer = document.getElementById('tasksContainer');
    const monthYearDisplay = document.getElementById('monthYear');
    const prevButton = document.getElementById('prevMonth');
    const nextButton = document.getElementById('nextMonth');

    // Function to generate calendar days
    function generateCalendar(month, year) {
        const firstDay = new Date(year, month - 1, 1).getDay();
        const daysInMonth = new Date(year, month, 0).getDate();
        
        // Clear existing days
        calendarGrid.innerHTML = calendarGrid.innerHTML.slice(0, 245); // Keep headers
        
        // Add empty cells for days before the 1st
        for (let i = 0; i < firstDay; i++) {
            const emptyButton = document.createElement('button');
            emptyButton.innerHTML = '<div></div>';
            calendarGrid.appendChild(emptyButton);
        }

        // Add day buttons
        for (let day = 1; day <= daysInMonth; day++) {
            const button = document.createElement('button');
            button.innerHTML = `<div>${day}</div>`;
            button.addEventListener('click', () => {
                // Remove active state from all buttons
                calendarGrid.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                updateTasks(day);
            });
            calendarGrid.appendChild(button);
        }
    }

    // Function to update task display
    function updateTasks(date) {
        const dateString = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
        const dayTasks = tasks[dateString] || [];
        
        // Clear existing tasks
        tasksContainer.innerHTML = '';

        // Add new tasks
        if (dayTasks.length === 0) {
            const noTasks = document.createElement('p');
            noTasks.textContent = 'No tasks for this date';
            noTasks.className = 'no-tasks';
            tasksContainer.appendChild(noTasks);
        } else {
            dayTasks.forEach(task => {
                const taskElement = createTaskElement(task);
                tasksContainer.appendChild(taskElement);
            });
        }
    }

    // Function to create task element
    function createTaskElement(task) {
        const div = document.createElement('div');
        div.className = 'task-item';
        div.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="task-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-32-80a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,136Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,168Z"></path>
                    </svg>
                </div>
                <div class="task-details flex flex-col justify-center">
                    <p>${task.title}</p>
                    <p>${task.description}</p>
                </div>
            </div>
            <div class="task-due">
                <p>${task.due}</p>
            </div>
        `;
        return div;
    }

    // Function to update calendar display
    function updateCalendar() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        monthYearDisplay.textContent = `${monthNames[currentMonth - 1]} ${currentYear}`;
        generateCalendar(currentMonth, currentYear);
    }

    // Navigation event listeners
    prevButton.addEventListener('click', () => {
        if (currentMonth === 1) {
            currentMonth = 12;
            currentYear--;
        } else {
            currentMonth--;
        }
        updateCalendar();
        tasksContainer.innerHTML = ''; // Clear tasks when changing month
    });

    nextButton.addEventListener('click', () => {
        if (currentMonth === 12) {
            currentMonth = 1;
            currentYear++;
        } else {
            currentMonth++;
        }
        updateCalendar();
        tasksContainer.innerHTML = ''; // Clear tasks when changing month
    });

    // Initial setup
    updateCalendar();
});