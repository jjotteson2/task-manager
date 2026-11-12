const taskInput = document.getElementById("task-input")
const addTaskBtn = document.getElementById("add-task-btn")
const taskList = document.getElementById("task-list")
const taskCounter = document.getElementById("task-counter")
const clearCompletedBtn = document.getElementById("clear-completed-btn")
const filterAllBtn = document.getElementById("filter-all")
const filterActiveBtn = document.getElementById("filter-active")
const filterCompletedBtn = document.getElementById("filter-completed")
const taskSearch = document.getElementById("task-search")
const clearSearchBtn = document.getElementById("clear-search-btn")
const taskDueDate = document.getElementById("task-due-date")
const darkModeBtn = document.getElementById("dark-mode-btn")
const taskPriority = document.getElementById("task-priority")

taskSearch.addEventListener("input", () => {
    console.log(taskSearch.value)
    searchText = taskSearch.value
    console.log(searchText)
    renderTasks()
})

let tasks = JSON.parse(localStorage.getItem("tasks") || "[]")
console.log(tasks)
let currentFilter = "all"
let searchText = ""
filterAllBtn.classList.add("active-filter")

filterAllBtn.addEventListener("click", () => {
    console.log("All filter clicked")
    currentFilter = "all"
    renderTasks()
    filterAllBtn.classList.add("active-filter")
    filterActiveBtn.classList.remove("active-filter")
    filterCompletedBtn.classList.remove("active-filter")
})

filterActiveBtn.addEventListener("click", () => {
    console.log("Active filter clicked")
    currentFilter = "active"
    renderTasks()
    filterActiveBtn.classList.add("active-filter")
    filterAllBtn.classList.remove("active-filter")
    filterCompletedBtn.classList.remove("active-filter")
})

filterCompletedBtn.addEventListener("click", () => {
    console.log("Completed filter clicked")
    currentFilter = "completed"
    renderTasks()
    filterActiveBtn.classList.remove("active-filter")
    filterAllBtn.classList.remove("active-filter")
    filterCompletedBtn.classList.add("active-filter")
})

clearSearchBtn.addEventListener("click", () => {
    taskSearch.value = ""
    searchText = ""
    renderTasks()
})

function createTaskElement(task) {
    const newTask = document.createElement("li")
    const deleteBtn = document.createElement("button")
    const editButton = document.createElement("button")
    const taskTextSpan = document.createElement("span")
    const dueDateSpan = document.createElement("span")
    const prioritySpan = document.createElement("span")
    dueDateSpan.classList.add("due-date")
    prioritySpan.classList.add("task-priority")
    prioritySpan.classList.add("priority-" + (task.priority || "medium"))

    deleteBtn.textContent = "Delete"
    deleteBtn.classList.add("delete-btn")
    taskTextSpan.textContent = task.text
    prioritySpan.textContent = task.priority || "medium"

    if (task.dueDate) {
        dueDateSpan.textContent = `Due: ${task.dueDate}`
    }

    newTask.appendChild(taskTextSpan)
    newTask.append(prioritySpan)
    newTask.appendChild(dueDateSpan)
    editButton.textContent = "Edit"
    editButton.classList.add("edit-btn")
    newTask.appendChild(editButton)

    if (task.completed === true) {
        newTask.classList.add("completed")
    }


    deleteBtn.addEventListener("click", (event) => {
        event.stopPropagation()
        const taskIndex = tasks.indexOf(task)

        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1)
            localStorage.setItem("tasks", JSON.stringify(tasks))
            updateTaskCounter()
            renderTasks()
        }
    })

    newTask.addEventListener("click", () => {
        newTask.classList.toggle("completed")
        task.completed = !task.completed
        console.log(task)
        localStorage.setItem("tasks", JSON.stringify(tasks))
        updateTaskCounter()
        renderTasks()
    })

    newTask.appendChild(deleteBtn)

    editButton.addEventListener("click", (event) => {
        event.stopPropagation()
        const newText = prompt("Enter task", task.text)
        
        if (newText !== null && newText.trim() !== "") {
            task.text = newText.trim()
            taskTextSpan.textContent = task.text
            console.log(task)
            localStorage.setItem("tasks", JSON.stringify(tasks))
            renderTasks()
        }
    })
    return newTask
}

tasks.forEach((task) => {
    const newTask = createTaskElement(task)
    taskList.appendChild(newTask)
})

addTaskBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim()
    const dueDate = taskDueDate.value
    const priority = taskPriority.value
    console.log(priority)

    if (taskText === "") {
        return
    }

    const task = {
        text: taskText,
        completed: false,
        dueDate: dueDate,
        priority: priority
    }
    tasks.push(task)
    localStorage.setItem("tasks", JSON.stringify(tasks))
    updateTaskCounter()
    console.log(tasks)
    
    renderTasks()
    taskInput.value = ""
    taskDueDate.value = ""
})

taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTaskBtn.click()
    }
})

function updateTaskCounter() {
    const remainingTasks = tasks.filter((task) => {
        return task.completed === false
    })
    taskCounter.textContent = `${remainingTasks.length} tasks remaining`
}

updateTaskCounter()

clearCompletedBtn.addEventListener("click", () => {
    const remainingTasks = tasks.filter((task) => {
        return task.completed === false
    })
    tasks = remainingTasks
    console.log(remainingTasks)
    localStorage.setItem("tasks", JSON.stringify(tasks))
    renderTasks()
    updateTaskCounter()
})

function renderTasks() {
    const matchingTasks = tasks.filter((task) => {
        return task.text.toLowerCase().includes(searchText.toLowerCase())
    })
    console.log(matchingTasks)
    taskList.innerHTML = ""
    
    if (currentFilter === "all") {
        matchingTasks.forEach((task) => {
            const newTask = createTaskElement(task)
            taskList.appendChild(newTask)
        })
    } else if (currentFilter === "active") {
        const activeTasks = matchingTasks.filter((task) => {
            return task.completed === false
        })
        activeTasks.forEach((task) => {
            const newTask = createTaskElement(task)
            taskList.appendChild(newTask)
        })
    } else if (currentFilter === "completed") {
        const completedTasks = matchingTasks.filter((task) => {
            return task.completed === true
        })
        completedTasks.forEach((task) => {
            const newTask = createTaskElement(task)
            taskList.appendChild(newTask)
        })
    }

    if (taskList.children.length === 0) {
        const noTasksMessage = document.createElement("p")
        noTasksMessage.classList.add("empty-message")
        if (searchText.length > 0) {
            noTasksMessage.textContent = "No matching tasks found"
        } else if (currentFilter === "active") {
            noTasksMessage.textContent = "No active tasks! You're all caught up."
        } else if (currentFilter === "completed") {
            noTasksMessage.textContent = "No completed tasks yet! Complete a task to see it here."
        } else {
            noTasksMessage.textContent = "You don't have any tasks to display."
        }
        taskList.appendChild(noTasksMessage)
    }
}
renderTasks()

darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode")
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"))

    if (document.body.classList.contains("dark-mode")) {
        darkModeBtn.textContent = "Light Mode"
    } else {
        darkModeBtn.textContent = "Dark Mode"
    }
})

if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode")
    darkModeBtn.textContent = "Light Mode"
}