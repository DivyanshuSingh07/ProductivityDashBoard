function initializeGoals() {
  resetDailyData();

  renderGreeting();

  renderOverallProgress();

  initializeDailyGoals();

  initializeHabits();

  initializeCategories();
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getYesterday() {
  const yesterday = new Date();

  yesterday.setDate(yesterday.getDate() - 1);

  return yesterday.toISOString().split("T")[0];
}
function resetDailyData() {
  const user = getCurrentUser();

  if (!user) return;

  const today = getToday();

  if (user.lastReset === today) {
    return;
  }

  resetDailyGoals(user);

  resetHabits(user);

  user.lastReset = today;

  updateCurrentUser(user);
}

function resetDailyGoals(user) {
  user.dailyGoals.forEach((goal) => {
    goal.completed = false;

    goal.createdAt = getToday();
  });
}

function resetHabits(user) {
  user.habits.forEach((habit) => {
    habit.completedToday = false;
  });
}

function renderGreeting() {
  const hour = new Date().getHours();

  let greeting = "";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  const user = getCurrentUser();

  document.getElementById("goal-greeting").textContent =
    `${greeting}, ${user.name}`;
}

function renderOverallProgress() {
  const user = getCurrentUser();

  if (!user) return;

  const total = user.dailyGoals.length;

  const completed = user.dailyGoals.filter((goal) => goal.completed).length;

  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  document.getElementById("overall-progress-fill").style.width = `${progress}%`;

  document.getElementById("overall-progress-text").textContent =
    `${completed}/${total} Goals Completed`;
}

function initializeDailyGoals() {
  const addBtn = document.getElementById("add-daily-goal");

  const closeBtn = document.getElementById("close-daily-modal");

  const cancelBtn = document.getElementById("cancel-daily-goal");

  const form = document.getElementById("daily-goal-form");

  const list = document.getElementById("daily-goals-list");

  addBtn.addEventListener("click", openDailyGoalModal);

  closeBtn.addEventListener("click", closeDailyGoalModal);

  cancelBtn.addEventListener("click", closeDailyGoalModal);

  form.addEventListener("submit", saveDailyGoal);

  list.addEventListener("click", handleDailyGoalActions);

  const overlay = document.getElementById("daily-goal-modal");

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeDailyGoalModal();
    }
  });

  renderDailyGoals();
}

function openDailyGoalModal() {
  document.getElementById("daily-goal-modal").classList.remove("hidden");
}

function closeDailyGoalModal() {
  document.getElementById("daily-goal-modal").classList.add("hidden");

  document.getElementById("daily-goal-form").reset();
}

function saveDailyGoal(event) {
  event.preventDefault();

  const user = getCurrentUser();

  if (!user) return;

  const title = document.getElementById("daily-goal-title").value.trim();

  if (title === "") return;

  user.dailyGoals.push({
    id: generateId(),

    title,

    category: document.getElementById("daily-goal-category").value,

    priority: document.getElementById("daily-goal-priority").value,

    notes: document.getElementById("daily-goal-notes").value.trim(),

    completed: false,

    createdAt: getToday(),
  });

  updateCurrentUser(user);

  closeDailyGoalModal();

  renderDailyGoals();

  renderOverallProgress();
}

function renderDailyGoals() {
  const user = getCurrentUser();

  if (!user) return;

  const container = document.getElementById("daily-goals-list");

  container.innerHTML = "";

  if (user.dailyGoals.length === 0) {
    container.innerHTML = `

            <div class="empty-state">

                <i class="ri-checkbox-circle-line"></i>

                <p>No Daily Goals</p>

            </div>

        `;

    return;
  }

  user.dailyGoals.forEach((goal) => {
    const item = document.createElement("div");

    item.className = "daily-goal";

    item.innerHTML = `

<div class="daily-left">

    <input

        type="checkbox"

        class="daily-checkbox"

        data-id="${goal.id}"

        ${goal.completed ? "checked" : ""}

    >

    <div class="daily-info">

        <h4 class="${goal.completed ? "daily-completed" : ""}">

            ${goal.title}

        </h4>

        <div class="daily-meta">

            <span class="daily-category">

                ${goal.category}

            </span>

            <span class="daily-priority">

                ${goal.priority}

            </span>

        </div>

        ${goal.notes ? `<p class="daily-notes">${goal.notes}</p>` : ""}

    </div>

</div>

<button

    class="delete-daily-goal"

    data-id="${goal.id}"

>

    <i class="ri-delete-bin-line"></i>

</button>

`;

    container.appendChild(item);
  });
}

function handleDailyGoalActions(event) {
  const user = getCurrentUser();

  if (!user) return;

  if (event.target.classList.contains("daily-checkbox")) {
    const id = Number(event.target.dataset.id);

    const goal = user.dailyGoals.find((goal) => goal.id === id);

    goal.completed = event.target.checked;

    updateCurrentUser(user);

    renderDailyGoals();

    renderOverallProgress();
  }

  const deleteBtn = event.target.closest(".delete-daily-goal");

  if (deleteBtn) {
    const id = Number(deleteBtn.dataset.id);

    user.dailyGoals = user.dailyGoals.filter((goal) => goal.id !== id);

    updateCurrentUser(user);

    renderDailyGoals();

    renderOverallProgress();
  }
}

function getCategoryClass(category) {
  switch (category) {
    case "Health":
      return "health";

    case "Learning":
      return "learning";

    case "Career":
      return "career";

    case "Personal":
      return "personal";

    case "Finance":
      return "finance";

    default:
      return "";
  }
}

/* ==========================
        INITIALIZE HABITS
========================== */

function initializeHabits() {
  const addBtn = document.getElementById("add-habit-btn");

  const closeBtn = document.getElementById("close-habit-modal");

  const cancelBtn = document.getElementById("cancel-habit");

  const form = document.getElementById("habit-form");

  const list = document.getElementById("habits-list");

  if (addBtn) {
    addBtn.addEventListener("click", openHabitModal);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeHabitModal);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", closeHabitModal);
  }

  if (form) {
    form.addEventListener("submit", saveHabit);
  }

  if (list) {
    list.addEventListener("click", handleHabitActions);
  }

  renderHabits();
}

function openHabitModal() {
  document.getElementById("habit-modal").classList.remove("hidden");
}

function closeHabitModal() {
  document.getElementById("habit-modal").classList.add("hidden");

  document.getElementById("habit-form").reset();
}

function saveHabit(event) {
  event.preventDefault();

  const user = getCurrentUser();

  if (!user) return;

  const title = document.getElementById("habit-title").value.trim();

  if (title === "") return;

  user.habits.push({
    id: generateId(),

    title,

    category: document.getElementById("habit-category").value,

    streak: 0,

    longestStreak: 0,

    completedToday: false,

    lastCompleted: null,
  });

  updateCurrentUser(user);

  closeHabitModal();

  renderHabits();
}

function renderHabits() {
  const user = getCurrentUser();

  if (!user) return;

  const container = document.getElementById("habits-list");

  container.innerHTML = "";

  if (user.habits.length === 0) {
    container.innerHTML = `

            <div class="empty-state">

                <i class="ri-fire-line"></i>

                <p>No Habits Yet</p>

            </div>

        `;

    return;
  }

  user.habits.forEach((habit) => {
    const card = document.createElement("div");

    card.className = "habit-card";

    card.innerHTML = `

            <div class="habit-header">

                <div>

                    <h4>${habit.title}</h4>

                    <span>${habit.category}</span>

                </div>

                <div class="habit-streak">

                    🔥 ${habit.streak} Day Streak

                </div>

                <div class="habit-longest">

                    Best: ${habit.longestStreak}

                </div>

            </div>

            <button

                class="habit-complete-btn"

                data-id="${habit.id}"

            >

                ${habit.completedToday ? "Completed Today" : "Mark Complete"}

            </button>

        `;

    container.appendChild(card);
  });
}

function handleHabitActions(event) {
  const button = event.target.closest(".habit-complete-btn");

  if (!button) return;

  const user = getCurrentUser();

  if (!user) return;

  const id = Number(button.dataset.id);

  const habit = user.habits.find((item) => item.id === id);

  if (!habit) return;

  if (habit.completedToday) return;

  completeHabit(habit);

  updateCurrentUser(user);

  renderHabits();
}

function completeHabit(habit) {
  const today = getToday();

  const yesterday = getYesterday();

  if (habit.completedToday) {
    return;
  }

  if (habit.lastCompleted === yesterday) {
    habit.streak++;
  } else if (habit.lastCompleted === today) {
    return;
  } else {
    habit.streak = 1;
  }

  habit.completedToday = true;

  habit.lastCompleted = today;

  if (habit.streak > habit.longestStreak) {
    habit.longestStreak = habit.streak;
  }
}


/* ==========================
        INITIALIZE CATEGORIES
========================== */

function initializeCategories(){

    renderCategories();

}

function renderCategories(){

    const user = getCurrentUser();

    if(!user) return;

    const container =

        document.getElementById(

            "life-categories"

        );

    container.innerHTML="";

    if(user.categories.length===0){

        container.innerHTML=`

            <div class="empty-state">

                <i class="ri-folder-open-line"></i>

                <p>No Categories Yet</p>

            </div>

        `;

        return;

    }

    user.categories.forEach(category=>{

        container.appendChild(

            createCategoryCard(category)

        );

    });

}

function getCategoryProgress(category){

    const total = category.goals.length;

    if(total===0){

        return 0;

    }

    const completed =

        category.goals.filter(

            goal=>goal.completed

        ).length;

    return Math.round(

        completed/total*100

    );

}

function createCategoryCard(category){

    const progress =
        getCategoryProgress(category);

    const card =
        document.createElement("div");

    card.className="category-card";

    card.innerHTML=`

        <div
            class="category-header"
            data-id="${category.id}"
        >

            <div>

                <h3>${category.name}</h3>

                <small>

                    ${progress}% Complete

                </small>

            </div>

            <i class="ri-arrow-down-s-line"></i>

        </div>

        <div class="category-progress">

            <div

                class="category-progress-fill"

                style="width:${progress}%"

            ></div>

        </div>

        <div

            class="category-body
            ${category.expanded ? "" : "hidden"}"

        >

        </div>

    `;

    const body =
        card.querySelector(".category-body");

    category.goals.forEach(goal=>{

        body.appendChild(

            createCategoryGoal(goal)

        );

    });

    body.insertAdjacentHTML(

        "beforeend",

        `

        <button

            class="add-category-goal"

            data-id="${category.id}"

        >

            <i class="ri-add-line"></i>

            Add Goal

        </button>

        `

    );

    return card;

}


function createCategoryGoal(goal){

    const row =
        document.createElement("div");

    row.className="category-goal";

    row.innerHTML=`

        <label>

            <input

                type="checkbox"

                class="category-checkbox"

                data-id="${goal.id}"

                ${goal.completed?"checked":""}

            >

            ${goal.title}

        </label>

    `;

    return row;

}

function initializeCategories(){

    const container =
        document.getElementById(

            "life-categories"

        );

    container.addEventListener(

        "click",

        handleCategoryActions

    );

    renderCategories();

}

function handleCategoryActions(event){

    const header =
        event.target.closest(".category-header");

    if(header){

        toggleCategory(

            Number(header.dataset.id)

        );

        return;

    }

}

function toggleCategory(categoryId){

    const user =
        getCurrentUser();

    const category =
        user.categories.find(

            item=>item.id===categoryId

        );

    category.expanded =
        !category.expanded;

    updateCurrentUser(user);

    renderCategories();

}