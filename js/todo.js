/* ==========================
        INITIALIZE TODO
========================== */

function initializeTodo() {

    const taskForm = document.getElementById("task-form");
    const taskList = document.getElementById("task-list");

    const searchInput = document.getElementById("task-search");
    const categoryFilter = document.getElementById("category-filter");
    const statusFilter = document.getElementById("status-filter");
    const sortTasks = document.getElementById("sort-tasks");

    if (taskForm) {

        taskForm.addEventListener("submit", saveTask);

    }

    if (taskList) {

        taskList.addEventListener("click", handleTaskActions);

    }

    if (searchInput) {

        searchInput.addEventListener("input", renderTasks);

    }

    if (categoryFilter) {

        categoryFilter.addEventListener("change", renderTasks);

    }

    if (statusFilter) {

        statusFilter.addEventListener("change", renderTasks);

    }

    if (sortTasks) {

        sortTasks.addEventListener("change", renderTasks);

    }

    renderTasks();

}

/* ==========================
        SAVE TASK
========================== */

function saveTask(event) {

    event.preventDefault();

    const currentUser = getCurrentUser();

    if(!currentUser) return;

    const taskId = document.getElementById("task-id").value;

    const task = {

        id: generateId(),

        title: document.getElementById("task-title").value.trim(),

        description: document.getElementById("task-description").value.trim(),

        category: document.getElementById("task-category").value,

        priority: document.getElementById("task-priority").value,

        dueDate: document.getElementById("task-date").value,

        status: document.getElementById("task-status").value,

        createdAt: new Date().toISOString()

    };

    if (task.title === "") {

    showToast("Task title is required.", "error");

    document.getElementById("task-title").focus();

    return;

    }

    if(taskId){

        const index = currentUser.todos.findIndex(
            task => task.id == taskId
        );

        task.id = Number(taskId);

        task.createdAt = currentUser.todos[index].createdAt;

        currentUser.todos[index] = task;

    }
    else{

        currentUser.todos.push(task);

    }

    updateCurrentUser(currentUser);

    showToast(
    taskId
        ? "Task updated successfully."
        : "Task created successfully.",
    "success"
    );

    closeTaskModal();

    renderTasks();

}
/* ==========================
        RENDER TASKS
========================== */

function renderTasks() {

    const currentUser = getCurrentUser();

    if (!currentUser) return;

    const taskList = document.getElementById("task-list");

    taskList.innerHTML = "";

    let tasks = [...currentUser.todos];

    const search = document
        .getElementById("task-search")
        .value
        .toLowerCase();

    const category = document
        .getElementById("category-filter")
        .value;

    const status = document
        .getElementById("status-filter")
        .value;

    const sort = document
        .getElementById("sort-tasks")
        .value;

    /* Search */

    tasks = tasks.filter(task =>

        task.title.toLowerCase().includes(search) ||

        task.description.toLowerCase().includes(search)

    );

    /* Category */

    if (category !== "all") {

        tasks = tasks.filter(
            task => task.category === category
        );

    }

    /* Status */

    if (status !== "all") {

        tasks = tasks.filter(
            task => task.status === status
        );

    }

    /* Sorting */

    switch (sort) {

        case "alphabetical":

            tasks.sort((a, b) =>
                a.title.localeCompare(b.title)
            );

            break;

        case "oldest":

            tasks.sort((a, b) =>
                new Date(a.createdAt) -
                new Date(b.createdAt)
            );

            break;

        default:

            tasks.sort((a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
            );

    }

    if (tasks.length === 0) {

        taskList.innerHTML = `

            <div class="empty-state">

                <i class="ri-inbox-line"></i>

                <h3>No Matching Tasks</h3>

                <p>Try changing the filters.</p>

            </div>

        `;
        updateDashboardStats();
        return;

    }

    tasks.forEach(task => {

        taskList.appendChild(
            createTaskCard(task)
        );

    });
    updateDashboardStats();
}


/* ==========================
        CREATE TASK CARD
========================== */

function createTaskCard(task) {

    const card = document.createElement("div");

    card.className = "task-card";

    card.innerHTML = `

        <h3>${task.title}</h3>

        <p>${task.description || "No description"}</p>

        <div class="task-meta">

            <span class="task-category">

                ${task.category}

            </span>

            <span class="task-status ${getStatusClass(task.status)}">

                ${task.status}

            </span>

        </div>

        <div class="task-extra">

        <span class="priority priority-${task.priority.toLowerCase()}">

            <i class="ri-flag-line"></i>

            ${task.priority}

        </span>

        <span class="due-date">

            <i class="ri-calendar-line"></i>

            ${task.dueDate || "No Due Date"}

        </span>

        </div>

        <div class="task-actions">

            <button
                class="edit-btn"
                data-id="${task.id}"
            >

                <i class="ri-edit-line"></i>

            </button>

            <button
                class="complete-btn"
                data-id="${task.id}"
            >

                <i class="ri-check-line"></i>

            </button>

            <button
                class="delete-btn"
                data-id="${task.id}"
            >

                <i class="ri-delete-bin-line"></i>

            </button>
        </div>

    `;

    return card;

}


/* ==========================
        STATUS COLOR
========================== */

function getStatusClass(status){

    switch(status){

        case "Completed":

            return "status-completed";

        case "In Progress":

            return "status-progress";

        default:

            return "status-pending";

    }

}

/* ==========================
        TASK ACTIONS
========================== */

function handleTaskActions(event) {

    const button = event.target.closest("button");

    if (!button) return;

    const taskId = Number(button.dataset.id);

    if (button.classList.contains("delete-btn")) {

        deleteTask(taskId);

    }

    else if (button.classList.contains("edit-btn")) {

        editTask(taskId);

    }

    else if (button.classList.contains("complete-btn")) {

        toggleTaskStatus(taskId);

    }

}

/* ==========================
        DELETE TASK
========================== */

function deleteTask(taskId) {

    const user = getCurrentUser();

    if (!user) return;

    user.todos = user.todos.filter(task => task.id !== taskId);

    updateCurrentUser(user);

    showToast(
        "Task deleted successfully.",
        "success"
    );

    renderTasks();

}


/* ==========================
        TOGGLE STATUS
========================== */

function toggleTaskStatus(taskId) {

    const user = getCurrentUser();

    if (!user) return;

    const task = user.todos.find(task => task.id === taskId);

    if (!task) return;

    switch (task.status) {

        case "Pending":

            task.status = "In Progress";
            break;

        case "In Progress":

            task.status = "Completed";
            break;

        default:

            task.status = "Pending";

    }

    updateCurrentUser(user);

    showToast(
        "Task status updated.",
        "info"
    );

    renderTasks();

}

/* ==========================
        EDIT TASK
========================== */

function editTask(taskId) {

    const user = getCurrentUser();

    if (!user) return;

    const task = user.todos.find(task => task.id === taskId);

    if (!task) return;

    document.getElementById("task-id").value = task.id;

    document.getElementById("task-title").value = task.title;

    document.getElementById("task-description").value = task.description;

    document.getElementById("task-category").value = task.category;

    document.getElementById("task-priority").value = task.priority;

    document.getElementById("task-date").value = task.dueDate;

    document.getElementById("task-status").value = task.status;

    document.getElementById("modal-title").textContent = "Edit Task";

    openTaskModal();

}


/* ==========================
        DASHBOARD STATS
========================== */

function updateDashboardStats() {

    const user = getCurrentUser();

    if (!user) return;

    const total = user.todos.length;

    const pending = user.todos.filter(
        task => task.status === "Pending"
    ).length;

    const completed = user.todos.filter(
        task => task.status === "Completed"
    ).length;

    document.getElementById("total-tasks").textContent = total;

    document.getElementById("pending-tasks").textContent = pending;

    document.getElementById("completed-tasks").textContent = completed;

    const goals = user.goals.length;

    document.getElementById("goals-count").textContent = goals;

}