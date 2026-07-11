let editingDailyGoalId = null;
let editingHabitId = null;
let editingCategoryId = null;


function initializeGoals() {

    resetDailyData();

    renderGreeting();

    renderOverallProgress();

    initializeDailyGoals();

    initializeHabits();

    initializeCategories();

    initializeBucketList();

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

    const dynamicGreetings = [
    `Focus on today, dream for tomorrow.`,
    `From today's habits to lifetime goals—let's get it done.`,
    `Ready to map out your day and your future?`,
    `Let's check some things off that bucket list.`
];

// Picks a random line from the array above
const randomLine = dynamicGreetings[Math.floor(Math.random() * dynamicGreetings.length)];
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
    `${greeting}, ${user.fullName}! ${randomLine}`;
    
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

  document.addEventListener("keydown", (event) => {

    if (
        event.key === "Escape" &&
        !document
            .getElementById("daily-goal-modal")
            .classList.contains("hidden")
    ) {

        closeDailyGoalModal();

    }

});

  renderDailyGoals();
}

function openDailyGoalModal(){

    document
        .getElementById("daily-goal-modal")
        .classList.remove("hidden");

    document
        .getElementById("daily-goal-title")
        .focus();

}

function closeDailyGoalModal(){

    editingDailyGoalId = null;

    document
        .getElementById("daily-goal-modal")
        .classList.add("hidden");

    document
        .getElementById("daily-goal-form")
        .reset();

    document.querySelector(
        "#daily-goal-modal h2"
    ).textContent = "Add Daily Goal";

    document.querySelector(
        '#daily-goal-form button[type="submit"]'
    ).textContent = "Save Goal";

}


function saveDailyGoal(event) {
  event.preventDefault();

  const user = getCurrentUser();

  if (!user) return;

  const title = document.getElementById("daily-goal-title").value.trim();

  const exists = user.dailyGoals.some(goal =>

    goal.title.toLowerCase() === title.toLowerCase() &&
    goal.id !== editingDailyGoalId

);

if(exists){

    alert("A goal with this title already exists.");

    return;

}

  if (title === "") return;

 if(editingDailyGoalId){

    const goal = user.dailyGoals.find(

        item => item.id === editingDailyGoalId

    );

    goal.title = title;

    goal.category =
        document.getElementById("daily-goal-category").value;

    goal.priority =
        document.getElementById("daily-goal-priority").value;

    goal.notes =
        document.getElementById("daily-goal-notes").value.trim();

}else{

    user.dailyGoals.push({

        id:generateId(),

        title,

        category:
            document.getElementById("daily-goal-category").value,

        priority:
            document.getElementById("daily-goal-priority").value,

        notes:
            document.getElementById("daily-goal-notes").value.trim(),

        completed:false,

        createdAt:getToday()

    });

}

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

    <h3>No Daily Goals</h3>

    <p>

        Start planning your day by adding your first goal.

    </p>

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

            <span class="daily-category ${getCategoryClass(goal.category)}">

    ${goal.category}

</span>

            <span class="daily-priority ${goal.priority.toLowerCase()}">

    ${goal.priority}

</span>

        </div>

        ${goal.notes ? `<p class="daily-notes">${goal.notes}</p>` : ""}

    </div>

</div>

<div class="daily-actions">

    <button
        class="edit-daily-goal"
        data-id="${goal.id}"
    >
        <i class="ri-edit-line"></i>
    </button>

    <button
        class="delete-daily-goal"
        data-id="${goal.id}"
    >
        <i class="ri-delete-bin-line"></i>
    </button>

</div>

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

  const editBtn =
    event.target.closest(".edit-daily-goal");

if(editBtn){

    editDailyGoal(

        Number(editBtn.dataset.id)

    );

    return;

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

  const overlay = document.getElementById("habit-modal");

overlay.addEventListener("click",(event)=>{

    if(event.target===overlay){

        closeHabitModal();

    }

});

document.addEventListener("keydown",(event)=>{

    if(

        event.key==="Escape" &&

        !document
            .getElementById("habit-modal")
            .classList.contains("hidden")

    ){

        closeHabitModal();

    }

});

  renderHabits();
}

function openHabitModal(){

    document
        .getElementById("habit-modal")
        .classList.remove("hidden");

    document
        .getElementById("habit-title")
        .focus();

}

function closeHabitModal(){

    editingHabitId = null;

    document
        .getElementById("habit-modal")
        .classList.add("hidden");

    document
        .getElementById("habit-form")
        .reset();

    document.querySelector(

        "#habit-modal h2"

    ).textContent = "Add Habit";

    document.querySelector(

        '#habit-form button[type="submit"]'

    ).textContent = "Save Habit";

}

function saveHabit(event) {
  event.preventDefault();

  const user = getCurrentUser();

  if (!user) return;

  const title = document.getElementById("habit-title").value.trim();

  const exists = user.habits.some(habit =>

    habit.title.toLowerCase() === title.toLowerCase() &&
    habit.id !== editingHabitId

);

if(exists){

    alert("Habit already exists.");

    return;

}

  if (title === "") return;

  if(editingHabitId){

    const habit = user.habits.find(

        item=>item.id===editingHabitId

    );

    habit.title = title;

    habit.category =
        document.getElementById("habit-category").value;

}else{

    user.habits.push({

        id:generateId(),

        title,

        category:
            document.getElementById("habit-category").value,

        streak:0,

        longestStreak:0,

        completedToday:false,

        lastCompleted:null

    });

}

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

        <span class="habit-category">
            ${habit.category}
        </span>

    </div>

    <div class="habit-actions">

    <button
        class="edit-habit-btn"
        data-id="${habit.id}"
    >
        <i class="ri-edit-line"></i>
    </button>

    <button
        class="delete-habit-btn"
        data-id="${habit.id}"
    >
        <i class="ri-delete-bin-line"></i>
    </button>

</div>

</div>

<div class="habit-streak">

    🔥 ${habit.streak} Day Streak

</div>

<div class="habit-longest">

    Best : ${habit.longestStreak}

</div>

<button

    class="habit-complete-btn"

    data-id="${habit.id}"

    ${habit.completedToday ? "disabled" : ""}

>

    ${habit.completedToday ? "Completed Today" : "Mark Complete"}

</button>

`;

    container.appendChild(card);
  });
}

function handleHabitActions(event) {
  const user = getCurrentUser();

  if (!user) return;

  const editBtn =

    event.target.closest(".edit-habit-btn");

if(editBtn){

    editHabit(

        Number(editBtn.dataset.id)

    );

    return;

}

  const deleteBtn = event.target.closest(".delete-habit-btn");

  if (deleteBtn) {
    const id = Number(deleteBtn.dataset.id);

    user.habits = user.habits.filter((habit) => habit.id !== id);

    updateCurrentUser(user);

    renderHabits();

    return;
  }

  const completeBtn = event.target.closest(".habit-complete-btn");

  if (!completeBtn) return;

  const id = Number(completeBtn.dataset.id);

  const habit = user.habits.find((item) => item.id === id);

  if (!habit) return;

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

function initializeCategories() {
  const addBtn = document.getElementById("add-category-btn");

  const closeBtn = document.getElementById("close-category-modal");

  const cancelBtn = document.getElementById("cancel-category");

  const form = document.getElementById("category-form");

  const container = document.getElementById("life-categories");

  addBtn.addEventListener(
    "click",

    openCategoryModal,
  );

  closeBtn.addEventListener(
    "click",

    closeCategoryModal,
  );

  cancelBtn.addEventListener(
    "click",

    closeCategoryModal,
  );

  form.addEventListener(
    "submit",

    saveCategory,
  );

  container.addEventListener(
    "click",

    handleCategoryActions,
  );

  const goalForm = document.getElementById("category-goal-form");

  const goalClose = document.getElementById("close-category-goal-modal");

  const goalCancel = document.getElementById("cancel-category-goal");

  goalForm.addEventListener("submit", saveCategoryGoal);

  goalClose.addEventListener("click", closeCategoryGoalModal);

  goalCancel.addEventListener("click", closeCategoryGoalModal);

  renderCategories();
}

function openCategoryModal() {
  document

    .getElementById("category-modal")

    .classList.remove("hidden");
}

function closeCategoryModal(){

    editingCategoryId = null;

    document
        .getElementById("category-modal")
        .classList.add("hidden");

    document
        .getElementById("category-form")
        .reset();

    document.querySelector(
        "#category-modal h2"
    ).textContent = "Add Category";

    document.querySelector(
        '#category-form button[type="submit"]'
    ).textContent = "Save Category";

}

function openCategoryGoalModal(categoryId) {
  document.getElementById("selected-category-id").value = categoryId;

  document.getElementById("category-goal-modal").classList.remove("hidden");
}

function closeCategoryGoalModal() {
  document.getElementById("category-goal-modal").classList.add("hidden");

  document.getElementById("category-goal-form").reset();
}

function saveCategory(event) {
  event.preventDefault();

  const user = getCurrentUser();

  if (!user) return;

  const name = document

    .getElementById("category-name")

    .value.trim();

  if (name === "") return;

  if(editingCategoryId){

    const category =

        user.categories.find(

            item=>item.id===editingCategoryId

        );

    category.name = name;

}else{

    user.categories.push({

        id:generateId(),

        name,

        expanded:false,

        goals:[]

    });

}

  updateCurrentUser(user);

  closeCategoryModal();

  renderCategories();
}

function renderCategories() {
  const user = getCurrentUser();

  if (!user) return;

  const container = document.getElementById("life-categories");

  container.innerHTML = "";

  if (user.categories.length === 0) {
    container.innerHTML = `

            <div class="empty-state">

                <i class="ri-folder-open-line"></i>

                <p>No Categories Yet</p>

            </div>

        `;

    return;
  }

  user.categories.forEach((category) => {
    container.appendChild(createCategoryCard(category));
  });
}

function getCategoryProgress(category) {
  const total = category.goals.length;

  if (total === 0) {
    return 0;
  }

  const completed = category.goals.filter((goal) => goal.completed).length;

  return Math.round((completed / total) * 100);
}

function createCategoryCard(category) {

    const totalGoals =
    category.goals.length;

const completedGoals =

    category.goals.filter(

        goal=>goal.completed

    ).length;
  const progress = getCategoryProgress(category);

  const card = document.createElement("div");

  card.className = "category-card";

  card.innerHTML = `

        <div
    class="category-header"
    data-id="${category.id}"
>

    <div>

        <h3>${category.name}</h3>

        <div class="category-stats">

    <span>

        ${completedGoals}/${totalGoals}

    </span>

    <span>

        ${progress}%

    </span>

</div>

    </div>

   <div class="category-header-actions">

    <button

        class="edit-category-btn"

        data-id="${category.id}"

    >

        <i class="ri-edit-line"></i>

    </button>

    <button

        class="delete-category-btn"

        data-id="${category.id}"

    >

        <i class="ri-delete-bin-line"></i>

    </button>

    <i class="ri-arrow-down-s-line"></i>

</div>

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

  const body = card.querySelector(".category-body");

  category.goals.forEach((goal) => {
    body.appendChild(createCategoryGoal(goal));
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

        `,
  );

  return card;
}

function createCategoryGoal(goal) {
  const row = document.createElement("div");

  row.className = "category-goal";

  row.innerHTML = `

        <div class="category-goal-left">

            <label>

                <input

                    type="checkbox"

                    class="category-checkbox"

                    data-id="${goal.id}"

                    ${goal.completed ? "checked" : ""}

                >

                <span>

                    ${goal.title}

                </span>

            </label>

        </div>

        <button

            class="delete-category-goal"

            data-id="${goal.id}"

        >

            <i class="ri-delete-bin-line"></i>

        </button>

    `;

  return row;
}

function handleCategoryActions(event){

    const editBtn =

    event.target.closest(".edit-category-btn");

if(editBtn){

    editCategory(

        Number(editBtn.dataset.id)

    );

    return;

}

    const deleteCategoryBtn =
        event.target.closest(".delete-category-btn");

    if(deleteCategoryBtn){

        deleteCategory(

            Number(deleteCategoryBtn.dataset.id)

        );

        return;

    }

    const deleteGoalBtn =
        event.target.closest(".delete-category-goal");

    if(deleteGoalBtn){

        deleteCategoryGoal(

            Number(deleteGoalBtn.dataset.id)

        );

        return;

    }

    const addGoalBtn =
        event.target.closest(".add-category-goal");

    if(addGoalBtn){

        openCategoryGoalModal(

            Number(addGoalBtn.dataset.id)

        );

        return;

    }

    const checkbox =
        event.target.closest(".category-checkbox");

    if(checkbox){

        toggleCategoryGoal(

            Number(checkbox.dataset.id),

            checkbox.checked

        );

        return;

    }

    const header =
        event.target.closest(".category-header");

    if(header){

        toggleCategory(

            Number(header.dataset.id)

        );

    }

}

function editCategory(categoryId){

    const user = getCurrentUser();

    if(!user) return;

    const category =

        user.categories.find(

            item=>item.id===categoryId

        );

    if(!category) return;

    editingCategoryId = category.id;

    document.getElementById(

        "category-name"

    ).value = category.name;

    document.querySelector(

        "#category-modal h2"

    ).textContent = "Edit Category";

    document.querySelector(

        '#category-form button[type="submit"]'

    ).textContent = "Save Changes";

    openCategoryModal();

}

function deleteCategory(categoryId) {
  const confirmDelete = confirm("Delete this category and all its goals?");

  if (!confirmDelete) {
    return;
  }

  const user = getCurrentUser();

  if (!user) return;

  user.categories = user.categories.filter(
    (category) => category.id !== categoryId,
  );

  updateCurrentUser(user);

  renderCategories();
}

function toggleCategoryGoal(goalId, completed) {
  const user = getCurrentUser();

  if (!user) return;

  user.categories.forEach((category) => {
    const goal = category.goals.find((item) => item.id === goalId);

    if (goal) {
      goal.completed = completed;
    }
  });

  updateCurrentUser(user);

  renderCategories();
}

function deleteCategoryGoal(goalId) {
  const user = getCurrentUser();

  if (!user) return;

  user.categories.forEach((category) => {
    category.goals = category.goals.filter((goal) => goal.id !== goalId);
  });

  updateCurrentUser(user);

  renderCategories();
}

function toggleCategory(categoryId) {
  const user = getCurrentUser();

  const category = user.categories.find((item) => item.id === categoryId);

  category.expanded = !category.expanded;

  updateCurrentUser(user);

  renderCategories();
}
function saveCategoryGoal(event) {
  event.preventDefault();

  const user = getCurrentUser();

  if (!user) return;

  const categoryId = Number(
    document.getElementById("selected-category-id").value,
  );

  const title = document.getElementById("category-goal-title").value.trim();

  if (title === "") return;

  const category = user.categories.find((item) => item.id === categoryId);

  if (!category) return;

  category.goals.push({
    id: generateId(),

    title,

    completed: false,
  });

  updateCurrentUser(user);

  closeCategoryGoalModal();

  renderCategories();
}



function editDailyGoal(goalId){

    const user = getCurrentUser();

    if(!user) return;

    const goal = user.dailyGoals.find(

        item => item.id === goalId

    );

    if(!goal) return;

    editingDailyGoalId = goal.id;

    document.getElementById("daily-goal-title").value =
        goal.title;

    document.getElementById("daily-goal-category").value =
        goal.category;

    document.getElementById("daily-goal-priority").value =
        goal.priority;

    document.getElementById("daily-goal-notes").value =
        goal.notes;

    document.querySelector(

        "#daily-goal-modal h2"

    ).textContent = "Edit Daily Goal";

    document.querySelector(

        '#daily-goal-form button[type="submit"]'

    ).textContent = "Save Changes";

    openDailyGoalModal();

}


function editHabit(habitId){

    const user = getCurrentUser();

    if(!user) return;

    const habit = user.habits.find(

        item=>item.id===habitId

    );

    if(!habit) return;

    editingHabitId = habit.id;

    document.getElementById("habit-title").value =
        habit.title;

    document.getElementById("habit-category").value =
        habit.category;

    document.querySelector(

        "#habit-modal h2"

    ).textContent = "Edit Habit";

    document.querySelector(

        '#habit-form button[type="submit"]'

    ).textContent = "Save Changes";

    openHabitModal();

}



/* ==========================
        INITIALIZE BUCKET LIST
========================== */

function initializeBucketList(){

    const addBtn =
        document.getElementById("add-bucket-btn");

    const closeBtn =
        document.getElementById("close-bucket-modal");

    const cancelBtn =
        document.getElementById("cancel-bucket");

    const form =
        document.getElementById("bucket-form");

    const container =
        document.getElementById("bucket-list");

    addBtn.addEventListener(

        "click",

        openBucketModal

    );

    closeBtn.addEventListener(

        "click",

        closeBucketModal

    );

    cancelBtn.addEventListener(

        "click",

        closeBucketModal

    );

    form.addEventListener(

        "submit",

        saveBucketItem

    );

    container.addEventListener(

        "click",

        handleBucketActions

    );

    renderBucketList();

}

function openBucketModal(){

    document

        .getElementById("bucket-modal")

        .classList.remove("hidden");

}

function closeBucketModal(){

    document

        .getElementById("bucket-modal")

        .classList.add("hidden");

    document

        .getElementById("bucket-form")

        .reset();

        editingBucketId=null;

    document

        .getElementById("editing-bucket-id")

        .value="";

    document

        .getElementById("bucket-modal-title")

        .textContent="Add Dream";

}

function saveBucketItem(event){

    event.preventDefault();

    const user = getCurrentUser();

    if(!user) return;

    const editingId =
        document
            .getElementById("editing-bucket-id")
            .value;

    const data = {

        title:
            document
                .getElementById("bucket-title")
                .value
                .trim(),

        category:
            document
                .getElementById("bucket-category")
                .value,

        priority:
            document
                .getElementById("bucket-priority")
                .value,

        targetDate:
            document
                .getElementById("bucket-date")
                .value,

        notes:
            document
                .getElementById("bucket-notes")
                .value
                .trim()

    };

    if(data.title === "") return;

    if(editingId){

        const item =
            user.bucketList.find(
                bucket => bucket.id === Number(editingId)
            );

        if(item){
            Object.assign(item, data);
        }

    }else{

        user.bucketList.push({

            id: generateId(),

            ...data,

            completed: false,

            createdAt: getToday()

        });

    }

    updateCurrentUser(user);

    closeBucketModal();

    renderBucketList();

}

function renderBucketList(){

    const user = getCurrentUser();

    if(!user) return;

    const container =
        document.getElementById("bucket-list");

    container.innerHTML="";

    if(user.bucketList.length===0){

        container.innerHTML=`

            <div class="empty-state">

                <i class="ri-flag-line"></i>

                <h3>No Dreams Yet</h3>

                <p>Add something you want to achieve.</p>

            </div>

        `;

        return;

    }

    user.bucketList.forEach(item=>{

        container.appendChild(

            createBucketCard(item)

        );

    });

}

function createBucketCard(item){

    const card=document.createElement("div");

    card.className="bucket-card";

    card.innerHTML=`

        <div class="bucket-card-header">

            <div>

                <h3 class="${
                    item.completed
                    ? "bucket-completed"
                    : ""
                }">

                    ${item.title}

                </h3>

                <div class="bucket-meta">

                    <span class="bucket-category">

                        ${item.category}

                    </span>

                    <span class="bucket-priority ${item.priority.toLowerCase()}">

                        ${item.priority}

                    </span>

                </div>

            </div>

            <div class="bucket-actions">

                <button

                    class="edit-bucket-btn"

                    data-id="${item.id}"

                >

                    <i class="ri-edit-line"></i>

                </button>

                <button

                    class="delete-bucket-btn"

                    data-id="${item.id}"

                >

                    <i class="ri-delete-bin-line"></i>

                </button>

            </div>

        </div>

        ${
            item.notes
            ?

            `<p class="bucket-notes">

                ${item.notes}

            </p>`

            :

            ""
        }

        ${
            item.targetDate

            ?

            `<div class="bucket-date">

                🎯 Target :

                ${item.targetDate}

            </div>`

            :

            ""
        }

        <button

            class="bucket-complete-btn"

            data-id="${item.id}"

        >

            ${
                item.completed

                ?

                "Completed"

                :

                "Mark Completed"

            }

        </button>

    `;

    return card;

}

function handleBucketActions(event){

    const completeBtn =
        event.target.closest(".bucket-complete-btn");

    if(completeBtn){

        toggleBucketComplete(

            Number(completeBtn.dataset.id)

        );

        return;

    }

    const editBtn =
        event.target.closest(".edit-bucket-btn");

    if(editBtn){

        editBucketItem(

            Number(editBtn.dataset.id)

        );

        return;

    }

    const deleteBtn =
        event.target.closest(".delete-bucket-btn");

    if(deleteBtn){

        deleteBucketItem(

            Number(deleteBtn.dataset.id)

        );

    }

}

function toggleBucketComplete(id){

    const user=getCurrentUser();

    if(!user) return;

    const item=

        user.bucketList.find(

            bucket=>bucket.id===id

        );

    if(!item) return;

    item.completed=!item.completed;

    updateCurrentUser(user);

    renderBucketList();

}

function deleteBucketItem(id){

    const confirmDelete = confirm(
        "Delete this bucket list item?"
    );

    if(!confirmDelete){
        return;
    }

    const user = getCurrentUser();

    if(!user) return;

    user.bucketList =
        user.bucketList.filter(

            item=>item.id!==id

        );

    updateCurrentUser(user);

    renderBucketList();

}


function editBucketItem(id){

    const user = getCurrentUser();

    if(!user) return;

    const item = user.bucketList.find(
        bucket => bucket.id === id
    );

    if(!item) return;

    document.getElementById("editing-bucket-id").value = item.id;

    document.getElementById("bucket-title").value = item.title;

    document.getElementById("bucket-category").value = item.category;

    document.getElementById("bucket-priority").value = item.priority;

    document.getElementById("bucket-date").value = item.targetDate;

    document.getElementById("bucket-notes").value = item.notes;

    openBucketModal();

}