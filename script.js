// Get DOM elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');

// Add todo function
function addTodo() {
    const todoText = todoInput.value.trim();
    
    // Check if input is not empty
    if (todoText === '') {
        alert('Please enter a todo!');
        return;
    }
    
    // Create list item
    const li = document.createElement('li');
    li.className = 'todo-item';
    
    // Create span for todo text
    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todoText;
    
    // Toggle completed state on click
    span.onclick = function() {
        span.classList.toggle('completed');
    };
    
    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = function() {
        li.remove();
    };
    
    // Append elements
    li.appendChild(span);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
    
    // Clear input
    todoInput.value = '';
    todoInput.focus();
}

// Event listeners
addBtn.addEventListener('click', addTodo);

// Allow adding todo with Enter key
todoInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});
