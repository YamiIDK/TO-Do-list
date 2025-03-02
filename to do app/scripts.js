document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const tasksList = document.getElementById('tasks-list');
    const newTaskInput = document.getElementById('new-task-input');
    const addTaskButton = document.getElementById('add-task-button');
    const clearListButton = document.getElementById('clear-list-button');
    const timerInput = document.getElementById('timer');
    const startTimerButton = document.getElementById('start-timer-button');
    const timerDisplay = document.getElementById('timer-display');
    const completedTasksList = document.getElementById('completed-tasks');
    const incompleteTasksList = document.getElementById('incomplete-tasks');
    const summarySection = document.getElementById('summary');

    let timerInterval;
    let timerStarted = false; // Flag to check if the timer has started

    // Load stored tasks and theme
    loadTasks();
    loadTheme();

    // Hide summary section initially
    summarySection.style.display = 'none';

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        themeToggle.textContent = body.classList.contains('dark-mode') ? '🌛' : '🌞';
        saveTheme();
    });

    // Add new task function
    function addTask() {
        if (newTaskInput.value.trim() !== '') {
            const taskItem = createTaskItem(newTaskInput.value);
            tasksList.appendChild(taskItem);
            saveTasks();
            newTaskInput.value = '';
        }
    }

    // Add new task on button click
    addTaskButton.addEventListener('click', addTask);

    // Add new task on Enter key press
    newTaskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Clear list
    clearListButton.addEventListener('click', () => {
        tasksList.innerHTML = '';
        saveTasks();
    });

    // Start timer
    startTimerButton.addEventListener('click', () => {
        const minutes = parseInt(timerInput.value);
        if (!isNaN(minutes) && minutes > 0) {
            if (timerInterval) clearInterval(timerInterval);
            let timeRemaining = minutes * 60;
            summarySection.style.display = 'none'; // Hide summary section
            timerStarted = true; // Mark that the timer has started
            updateTimerDisplay(timeRemaining);
            timerInterval = setInterval(() => {
                timeRemaining--;
                updateTimerDisplay(timeRemaining);
                if (timeRemaining <= 0) {
                    clearInterval(timerInterval);
                    displaySummary();
                    tasksList.innerHTML = '';
                    saveTasks();
                    updateTimerDisplay(0);
                    summarySection.style.display = 'block'; // Show summary section
                }
            }, 1000);
        }
    });

    // Update timer display
    function updateTimerDisplay(time) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Create task item
    function createTaskItem(taskText) {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', saveTasks);

        const textSpan = document.createElement('span');
        textSpan.textContent = taskText;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '❌';
        deleteButton.addEventListener('click', () => {
            li.remove();
            saveTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(textSpan);
        li.appendChild(deleteButton);

        return li;
    }

    // Save tasks to local storage
    function saveTasks() {
        const tasks = [];
        tasksList.querySelectorAll('li').forEach(taskItem => {
            tasks.push({
                text: taskItem.querySelector('span').textContent,
                done: taskItem.querySelector('input[type="checkbox"]').checked,
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Load tasks from local storage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const taskItem = createTaskItem(task.text);
            if (task.done) {
                taskItem.querySelector('input[type="checkbox"]').checked = true;
            }
            tasksList.appendChild(taskItem);
        });
    }

    // Save theme to local storage
    function saveTheme() {
        localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
    }

    // Load theme from local storage
    function loadTheme() {
        if (localStorage.getItem('darkMode') === 'true') {
            body.classList.add('dark-mode');
            themeToggle.textContent = '🌛';
        } else {
            themeToggle.textContent = '🌞';
        }
    }

    // Display summary
    function displaySummary() {
        const completedTasks = [];
        const incompleteTasks = [];
        tasksList.querySelectorAll('li').forEach(taskItem => {
            const taskText = taskItem.querySelector('span').textContent;
            const taskDone = taskItem.querySelector('input[type="checkbox"]').checked;
            if (taskDone) {
                completedTasks.push(taskText);
            } else {
                incompleteTasks.push(taskText);
            }
        });

        // Display completed tasks
        completedTasksList.innerHTML = '';
        completedTasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task;
            completedTasksList.appendChild(li);
        });

        // Display incomplete tasks
        incompleteTasksList.innerHTML = '';
        incompleteTasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task;
            incompleteTasksList.appendChild(li);
        });
    }
});
