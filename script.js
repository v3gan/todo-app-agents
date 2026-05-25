// Get DOM elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');
const taskCountEl = document.getElementById('taskCount');
const emptyState = document.getElementById('emptyState');
const filterBtns = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';

// ── Counter & empty-state helpers ──
function updateCounter() {
    const items = todoList.querySelectorAll('.todo-item');
    const activeCount = [...items].filter(
        li => !li.querySelector('.todo-text').classList.contains('completed')
    ).length;
    taskCountEl.textContent = activeCount;
}

function updateEmptyState() {
    const visibleItems = todoList.querySelectorAll('.todo-item:not([hidden])');
    emptyState.classList.toggle('hidden', visibleItems.length > 0);
}

// ── Filter logic ──
function applyFilter() {
    const items = todoList.querySelectorAll('.todo-item');
    items.forEach(li => {
        const isCompleted = li.querySelector('.todo-text').classList.contains('completed');
        let visible = true;
        if (currentFilter === 'active' && isCompleted) visible = false;
        if (currentFilter === 'completed' && !isCompleted) visible = false;
        li.hidden = !visible;
    });
    updateEmptyState();
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        applyFilter();
    });
});

// ── Add todo ──
function addTodo() {
    const todoText = todoInput.value.trim();

    if (todoText === '') {
        todoInput.classList.add('shake');
        todoInput.addEventListener('animationend', () => todoInput.classList.remove('shake'), { once: true });
        todoInput.focus();
        return;
    }

    // Create list item
    const li = document.createElement('li');
    li.className = 'todo-item';

    // Custom checkbox
    const checkbox = document.createElement('div');
    checkbox.className = 'todo-checkbox';
    checkbox.setAttribute('role', 'checkbox');
    checkbox.setAttribute('aria-checked', 'false');
    checkbox.setAttribute('tabindex', '0');

    // Todo text
    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todoText;

    // Toggle completed state
    function toggleComplete() {
        const isNowCompleted = !span.classList.contains('completed');
        span.classList.toggle('completed', isNowCompleted);
        checkbox.classList.toggle('checked', isNowCompleted);
        checkbox.setAttribute('aria-checked', String(isNowCompleted));
        updateCounter();
        applyFilter();
    }

    checkbox.addEventListener('click', toggleComplete);
    checkbox.addEventListener('keydown', e => {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleComplete(); }
    });
    span.addEventListener('click', toggleComplete);

    // Delete button (× symbol)
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '&times;';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.addEventListener('click', () => {
        li.classList.add('removing');
        li.addEventListener('animationend', () => {
            li.remove();
            updateCounter();
            updateEmptyState();
        }, { once: true });
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);

    // Apply current filter to the new item immediately
    if (currentFilter === 'completed') li.hidden = true;

    todoInput.value = '';
    todoInput.focus();
    updateCounter();
    updateEmptyState();
}

addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') addTodo();
});

// ── Theme ──
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-theme');
        themeIcon.textContent = '🌙';
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
        themeIcon.textContent = '☀️';
    } else {
        localStorage.setItem('theme', 'light');
        themeIcon.textContent = '🌙';
    }
}

loadTheme();
themeToggle.addEventListener('click', toggleTheme);

// ── Initial empty-state ──
updateEmptyState();

