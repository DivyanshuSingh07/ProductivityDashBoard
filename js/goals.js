/* ==========================
        INITIALIZE GOALS
========================== */

function initializeGoals() {

    const addGoalBtn = document.getElementById("add-goal-btn");

    const goalForm = document.getElementById("goal-form");

    const goalsList = document.getElementById("goals-list");

    const deleteBtn = document.getElementById("delete-goal");

    const closeBtn = document.getElementById("close-goal-modal");

const cancelBtn = document.getElementById("cancel-goal");

const overlay = document.getElementById("goal-modal");

if (closeBtn) {

    closeBtn.addEventListener(
        "click",
        closeGoalModal
    );

}

if (cancelBtn) {

    cancelBtn.addEventListener(
        "click",
        closeGoalModal
    );

}

if (overlay) {

    overlay.addEventListener("click", (event) => {

        if (event.target === overlay) {

            closeGoalModal();

        }

    });

}

    if (addGoalBtn) {

        addGoalBtn.addEventListener(
            "click",
            openGoalModal
        );

    }

    if (goalForm) {

        goalForm.addEventListener(
            "submit",
            saveGoal
        );

    }

    if (goalsList) {

        goalsList.addEventListener(
            "click",
            handleGoalActions
        );

    }

    if (deleteBtn) {

        deleteBtn.addEventListener(
            "click",
            deleteGoal
        );

    }

    renderGoals();

}

/* ==========================
        OPEN GOAL MODAL
========================== */

function openGoalModal() {

    document
        .getElementById("goal-modal")
        .classList.remove("hidden");

}

/* ==========================
        CLOSE GOAL MODAL
========================== */

function closeGoalModal() {

    document
        .getElementById("goal-modal")
        .classList.add("hidden");

    document
        .getElementById("goal-form")
        .reset();

    document
        .getElementById("goal-id")
        .value = "";

    document
        .getElementById("goal-modal-title")
        .textContent = "Add Goal";

    document
        .getElementById("delete-goal")
        .classList.add("hidden");

}


/* ==========================
        SAVE GOAL
========================== */

function saveGoal(event) {

    event.preventDefault();

    const user = getCurrentUser();

    if (!user) return;

    const title = document
        .getElementById("goal-title")
        .value
        .trim();

    if (title === "") {

        document
            .getElementById("goal-title")
            .focus();

        return;

    }

    const goal = {

        id: generateId(),

        title: title,

        target: Number(

            document.getElementById("goal-target").value

        ),

        progress: Number(

            document.getElementById("goal-progress").value

        ),

        completed: false

    };

    const goalId =

        document.getElementById("goal-id").value;

    if (goalId) {

        const index = user.goals.findIndex(

            item => item.id == goalId

        );

        goal.id = Number(goalId);

        goal.completed =

            goal.progress >= goal.target;

        user.goals[index] = goal;

    }

    else {

        goal.completed =

            goal.progress >= goal.target;

        user.goals.push(goal);

    }

    updateCurrentUser(user);

    closeGoalModal();

    renderGoals();

}


/* ==========================
        RENDER GOALS
========================== */

function renderGoals() {

    const user = getCurrentUser();

    if (!user) return;

    const goalsList =

        document.getElementById("goals-list");

    goalsList.innerHTML = "";

    if (user.goals.length === 0) {

        goalsList.innerHTML = `

            <div class="empty-state">

                <i class="ri-focus-3-line"></i>

                <h3>No Goals Yet</h3>

                <p>Create your first goal.</p>

            </div>

        `;

        updateGoalStats();

        return;

    }

    user.goals.forEach(goal => {

        goalsList.appendChild(

            createGoalCard(goal)

        );

    });

    updateGoalStats();

}


/* ==========================
        CREATE GOAL CARD
========================== */

function createGoalCard(goal) {

    const card = document.createElement("div");

    card.className = "goal-card";

    const percentage = Math.min(

        (goal.progress / goal.target) * 100,

        100

    );

    card.innerHTML = `

        <h3>${goal.title}</h3>

        <p>

            ${goal.progress} / ${goal.target}

        </p>

        <div class="goal-progress">

            <div
                class="goal-progress-fill"
                style="width:${percentage}%"
            ></div>

        </div>

        <div class="goal-actions">

            <button
                class="edit-goal-btn"
                data-id="${goal.id}"
            >

                Edit

            </button>

            <button
                class="progress-goal-btn"
                data-id="${goal.id}"
            >

                +1

            </button>

        </div>

    `;

    return card;

}


/* ==========================
        GOAL ACTIONS
========================== */

function handleGoalActions(event) {

    const button = event.target.closest("button");

    if (!button) return;

    const goalId = Number(button.dataset.id);

    if (button.classList.contains("edit-goal-btn")) {

        editGoal(goalId);

    }

    else if (button.classList.contains("progress-goal-btn")) {

        updateGoalProgress(goalId);

    }

}


/* ==========================
        EDIT GOAL
========================== */

function editGoal(goalId) {

    const user = getCurrentUser();

    if (!user) return;

    const goal = user.goals.find(

        goal => goal.id === goalId

    );

    if (!goal) return;

    document.getElementById("goal-id").value = goal.id;

    document.getElementById("goal-title").value = goal.title;

    document.getElementById("goal-target").value = goal.target;

    document.getElementById("goal-progress").value = goal.progress;

    document.getElementById("goal-modal-title").textContent = "Edit Goal";

    document

        .getElementById("delete-goal")

        .classList.remove("hidden");

    openGoalModal();

}

/* ==========================
        DELETE GOAL
========================== */

function deleteGoal() {

    const user = getCurrentUser();

    if (!user) return;

    const goalId = Number(

        document.getElementById("goal-id").value

    );

    user.goals = user.goals.filter(

        goal => goal.id !== goalId

    );

    updateCurrentUser(user);

    closeGoalModal();

    renderGoals();

}

/* ==========================
        UPDATE PROGRESS
========================== */

function updateGoalProgress(goalId) {

    const user = getCurrentUser();

    if (!user) return;

    const goal = user.goals.find(

        goal => goal.id === goalId

    );

    if (!goal) return;

    if (goal.progress < goal.target) {

        goal.progress++;

    }

    if (goal.progress >= goal.target) {

        goal.completed = true;

    }

    updateCurrentUser(user);

    renderGoals();

}

/* ==========================
        GOAL STATS
========================== */

function updateGoalStats() {

    const user = getCurrentUser();

    if (!user) return;

    const goalsCount = document.getElementById("goals-count");

    if (goalsCount) {

        goalsCount.textContent = user.goals.length;

    }

}