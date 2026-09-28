let task = []

const taskForm = document.getelementById('task-form')
const taskInput = document.getelementById('task-input')
const taskStatus = document.getelementById('task-status')
const tasksections = document.getelementById('task-sections')

function addTask(e){
    console.log("task added successfully")
}

taskForm.addEventListener('submit', addTask)