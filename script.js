let tasks = []
let currentFilter = 'all'

const taskForm = document.getElementById('task-form')
const taskInput = document.getElementById('taskTitle')
const taskStatus = document.getElementById('task-status')
const taskList = document.getElementById('task-list')

function getFilteredTasks() {
    if (currentFilter === 'pending') {
        return tasks.filter(function(task) {
            return task.status === 'pending'
        })
    }

    if (currentFilter === 'completed') {
        return tasks.filter(function(task) {
            return task.status === 'completed'
        })
    }

    return tasks
}

function renderTasks() {
    taskList.innerHTML = ''

    const filteredTasks = getFilteredTasks()

    filteredTasks.forEach((task) => {
        const taskElement = document.createElement('div')
        taskElement.classList.add('task-card')

        taskElement.innerHTML = `
            <h3>${task.title}</h3>
            <p>Status: ${task.status}</p>

            <button class="complete-button" data-id="${task.id}">
                Mark Completed
            </button>

            <button class="delete-button" data-id="${task.id}">
                Delete
            </button>
        `

        const completeButton = taskElement.querySelector('.complete-button')
        completeButton.addEventListener('click', function() {
            completeTask(task.id)
        })

        const deleteButton = taskElement.querySelector('.delete-button')
        deleteButton.addEventListener('click', function() {
            deleteTask(task.id)
        })

        taskList.appendChild(taskElement)
    })
}

function addTask(e) {
    e.preventDefault()

    const title = taskInput.value.trim()
    const status = taskStatus.value

    if (!title) {
        console.log('Please enter a task title')
        return
    }

    const newTask = {
        id: Date.now(),
        title,
        status,
    }

    tasks.push(newTask)
    console.log('Task added:', newTask)
    console.log('All tasks:', tasks)

    renderTasks()
    taskForm.reset()
    taskInput.focus()
}

function completeTask(id) {
    const task = tasks.find(function(task) {
        return task.id === id
    })

    if (task) {
        task.status = 'completed'
    }

    renderTasks()
}

function deleteTask(id) {
    tasks = tasks.filter(function(task) {
        return task.id !== id
    })

    renderTasks()
}

taskForm.addEventListener('submit', addTask)

renderTasks()
