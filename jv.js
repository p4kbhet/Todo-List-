document.addEventListener("DOMContentLoaded", function () {
    const todoForm = document.getElementById("todo-form");
    const todoInput = document.getElementById("todo-input");
    const todoList = document.getElementById("todo-list");
    const dateTimeElement = document.getElementById("date-time");

    loadTasks();

    // Function to update date and time
    function updateDateTime() {
        const now = new Date();
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true
        };
        const dateTimeString = now.toLocaleDateString("en-US", options);
        dateTimeElement.textContent = dateTimeString;
    }
	updateDateTime();

	

    todoForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const todoText = todoInput.value;
        if (todoText.trim() !== "") {
            addTodoItem(todoText);
            todoInput.value = "";
            saveTasks();
        }
    });

    todoList.addEventListener("click", function (event) {
        const target = event.target;
        if (target.classList.contains("delete-btn")) {
            deleteTodoItem(target);
            saveTasks();
        } else if (target.classList.contains("edit-btn")) {
            editTodoItem(target);
            saveTodoItem(target);
            saveTasks();
        } else if (target.classList.contains("complete-btn")) {
            completeTodoItem(target);
            saveTasks();
        }
    });
    function addTodoItem(text) {
        const existingTasks = document.querySelectorAll(".todo-item span:nth-child(1)");
        for (const task of existingTasks) {
            if (task.innerText === text) {
                alert("Task already exists!");
                return;
            }
        }
    
        const listItem = document.createElement("li");
        listItem.className = "todo-item";
        listItem.innerHTML = `
            <span>${text}</span>
            <button class="complete-btn">Complete</button>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
        todoList.appendChild(listItem);
    }

    function deleteTodoItem(deleteBtn) {
        const listItem = deleteBtn.parentElement;
        todoList.removeChild(listItem);
    }

    function editTodoItem(editBtn) {
        const listItem = editBtn.parentElement;
        if (!listItem.classList.contains("completed")) {
            const textSpan = listItem.querySelector("span:nth-child(1)");
            const newText = prompt("Edit todo:", textSpan.innerText);
            if (newText !== null) {
                textSpan.innerText = newText;
                listItem.classList.remove("editing");
            }
        }
    }

    function saveTodoItem(saveBtn) {
        const listItem = saveBtn.parentElement;
        const textSpan = listItem.querySelector("span:nth-child(1)");
        const newText = textSpan.innerText;
        listItem.classList.remove("editing");
    }
    
    

    function completeTodoItem(completeBtn) {
        const listItem = completeBtn.parentElement;
        const textSpan = listItem.querySelector("span:nth-child(1)");
        const completeButton = listItem.querySelector(".complete-btn");

        if (listItem.classList.contains("completed")) {
            listItem.classList.remove("completed");
            completeButton.innerText = "Complete";
        } else {
            listItem.classList.add("completed");
            completeButton.innerText = "Undo";
        }
    }

    function saveTasks() {
        const tasks = [];
        const todoItems = document.querySelectorAll(".todo-item span:nth-child(1)");
        const completedItems = document.querySelectorAll(".todo-item.completed span:nth-child(1)");
        todoItems.forEach(function (item) {
            tasks.push({ text: item.innerText, completed: false });
        });
        completedItems.forEach(function (item) {
            tasks.push({ text: item.innerText, completed: true });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const storedTasks = localStorage.getItem("tasks");
        if (storedTasks) {
            const tasks = JSON.parse(storedTasks);
            tasks.forEach(function (task) {
                addTodoItem(task.text);
                const listItem = todoList.lastChild;
                if (task.completed) {
                    listItem.classList.add("completed");
                    listItem.querySelector(".complete-btn").innerText = "Undo";
                }
            });
        }
    }
});
