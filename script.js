const storageKey = 'task-manager-tasks'
const taskForm = document.getElementById('task-form')
const taskInput = document.getElementById('taskTitle')
const taskStatus = document.getElementById('task-status')
const taskList = document.getElementById('task-list')
const filterButtons = document.querySelectorAll('.filter-btn')
let currentFilter = 'all'
let tasks = loadTasks()

function loadTasks() {
    try {
        const savedTasks = JSON.parse(localStorage.getItem(storageKey) || '[]')
        if (!Array.isArray(savedTasks)) return []

        return savedTasks.filter(function(task) {
            return task && typeof task.id === 'number' &&
                typeof task.title === 'string' &&
                (task.status === 'pending' || task.status === 'completed')
        })
    } catch (error) {
        return []
    }
}

function saveTasks() {
    try {
        localStorage.setItem(storageKey, JSON.stringify(tasks))
    } catch (error) {
        console.warn('Tasks could not be saved in this browser.')
    }
}

function getFilteredTasks() {
    if (currentFilter === 'all') return tasks

    return tasks.filter(function(task) {
        return task.status === currentFilter
    })
}

function renderTasks() {
    taskList.replaceChildren()

    filterButtons.forEach(function(button) {
        const isActive = button.dataset.filter === currentFilter
        button.classList.toggle('active', isActive)
        button.setAttribute('aria-pressed', String(isActive))
    })

    const filteredTasks = getFilteredTasks()
    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement('p')
        emptyMessage.className = 'empty-state'
        emptyMessage.textContent = tasks.length === 0
            ? 'No tasks yet. Add one above to get started.'
            : 'No ' + currentFilter + ' tasks.'
        taskList.appendChild(emptyMessage)
        return
    }

    filteredTasks.forEach(function(task) {
        const taskElement = document.createElement('article')
        taskElement.className = 'task-card'

        const title = document.createElement('h3')
        title.textContent = task.title

        const status = document.createElement('p')
        status.className = 'task-status-label ' + task.status
        status.textContent = task.status

        const actions = document.createElement('div')
        actions.className = 'task-actions'

        const completeButton = document.createElement('button')
        completeButton.className = 'complete-button'
        completeButton.type = 'button'
        completeButton.textContent = task.status === 'completed' ? 'Completed' : 'Mark completed'
        completeButton.disabled = task.status === 'completed'
        completeButton.addEventListener('click', function() {
            completeTask(task.id)
        })

        const deleteButton = document.createElement('button')
        deleteButton.className = 'delete-button'
        deleteButton.type = 'button'
        deleteButton.textContent = 'Delete'
        deleteButton.addEventListener('click', function() {
            deleteTask(task.id)
        })

        actions.append(completeButton, deleteButton)
        taskElement.append(title, status, actions)
        taskList.appendChild(taskElement)
    })
}

function addTask(event) {
    event.preventDefault()

    const title = taskInput.value.trim()
    if (!title) {
        taskInput.focus()
        return
    }

    tasks.push({
        id: Date.now(),
        title: title,
        status: taskStatus.value,
    })

    saveTasks()
    renderTasks()
    taskForm.reset()
    taskInput.focus()
}

function completeTask(id) {
    const task = tasks.find(function(item) {
        return item.id === id
    })

    if (task) {
        task.status = 'completed'
        saveTasks()
        renderTasks()
    }
}

function deleteTask(id) {
    tasks = tasks.filter(function(task) {
        return task.id !== id
    })

    saveTasks()
    renderTasks()
}

taskForm.addEventListener('submit', addTask)

filterButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        currentFilter = button.dataset.filter
        renderTasks()
    })
})

renderTasks()
