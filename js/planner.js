/* ==========================
        PLANNER STATE
========================== */

let currentDate = new Date();

let currentMonth = currentDate.getMonth();

let currentYear = currentDate.getFullYear();

/* ==========================
        INITIALIZE PLANNER
========================== */

// function initializePlanner() {

//     const prevBtn = document.getElementById("prev-month");
//     const nextBtn = document.getElementById("next-month");

//     if (!prevBtn || !nextBtn) return;

//     prevBtn.addEventListener("click", previousMonth);

//     nextBtn.addEventListener("click", nextMonth);

//     renderCalendar();

// }

function initializePlanner() {

  const prevBtn = document.getElementById("prev-month");
  const nextBtn = document.getElementById("next-month");

  if (!prevBtn || !nextBtn) return;

  prevBtn.addEventListener("click", previousMonth);
  nextBtn.addEventListener("click", nextMonth);

  renderCalendar();

  const plannerForm = document.getElementById("planner-form");

  if (plannerForm) {
    plannerForm.addEventListener("submit", savePlannerEvent);
  }

  const deleteBtn = document.getElementById("delete-event");

if (deleteBtn) {

    deleteBtn.addEventListener(
        "click",
        deletePlannerEvent
    );

}
}

/* ==========================
        PREVIOUS MONTH
========================== */

function previousMonth() {
  currentMonth--;

  if (currentMonth < 0) {
    currentMonth = 11;

    currentYear--;
  }

  renderCalendar();
}

/* ==========================
        NEXT MONTH
========================== */

function nextMonth() {
  currentMonth++;

  if (currentMonth > 11) {
    currentMonth = 0;

    currentYear++;
  }

  renderCalendar();
}

/* ==========================
        RENDER CALENDAR
========================== */

function renderCalendar() {

  const monthHeading = document.getElementById("current-month");

  const calendarGrid = document.getElementById("calendar-grid");

  if (!monthHeading || !calendarGrid) return;

  calendarGrid.innerHTML = "";

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  monthHeading.textContent = `${months[currentMonth]} ${currentYear}`;

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

  /* Empty boxes before the 1st */

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");

    empty.className = "calendar-day empty";

    calendarGrid.appendChild(empty);
  }

  /* Days */

    for (let day = 1; day <= totalDays; day++) {

        const cell = document.createElement("div");

        cell.className = "calendar-day";

        cell.textContent = day;

        highlightToday(cell, day);

        addPlannerIndicator(cell, day);

        cell.addEventListener("click", () => {

        selectDate(day, cell);

        });

        calendarGrid.appendChild(cell);

    }
}

/* ==========================
        HIGHLIGHT TODAY
========================== */

function highlightToday(cell, day) {
  const today = new Date();

  if (
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear()
  ) {
    cell.classList.add("today");
  }
}

/* ==========================
        EVENT INDICATOR
========================== */

function addPlannerIndicator(cell, day) {

    const user = getCurrentUser();

    if (!user) return;

    const date =

        `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const hasEvent = user.planner.some(

        event => event.date === date

    );

    if (!hasEvent) return;

    const dot = document.createElement("span");

    dot.className = "planner-dot";

    cell.appendChild(dot);

}

/* ==========================
        SELECT DATE
========================== */

function selectDate(day, cell) {

    document
        .querySelectorAll(".calendar-day")
        .forEach(item => {

            item.classList.remove("selected");

        });

    cell.classList.add("selected");

    const selectedDate =
        `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    document.getElementById("selected-date").value = selectedDate;

    document.getElementById("planner-modal-title").textContent = "Add Event";

    openPlannerModal();

}

/* ==========================
        LOAD EVENT
========================== */

function loadPlannerEvent(date) {

    const user = getCurrentUser();

    if (!user) return;

    const event = user.planner.find(

        item => item.date === date

    );

    document.getElementById("planner-form").reset();

    document.getElementById("selected-date").value = date;

    if (!event) {

        document.getElementById("event-id").value = "";

        document.getElementById("planner-modal-title").textContent =
            "Add Event";

        document
            .getElementById("delete-event")
            .classList.add("hidden");

        openPlannerModal();

        return;

    }

    document.getElementById("event-id").value = event.id;

    document.getElementById("event-title").value = event.title;

    document.getElementById("event-category").value = event.category;

    document.getElementById("event-time").value = event.time;

    document.getElementById("planner-modal-title").textContent =
        "Edit Event";

    document
        .getElementById("delete-event")
        .classList.remove("hidden");

    openPlannerModal();

}
/* ==========================
        SAVE EVENT
========================== */

function savePlannerEvent(event) {

    event.preventDefault();

    const user = getCurrentUser();

    if (!user) return;

    const title = document
        .getElementById("event-title")
        .value
        .trim();

    if (title === "") {

        document.getElementById("event-title").focus();

        return;

    }

    const plannerEvent = {

        id: generateId(),

        title: title,

        category: document.getElementById("event-category").value,

        time: document.getElementById("event-time").value,

        date: document.getElementById("selected-date").value

    };

    const eventId =
        document.getElementById("event-id").value;

    if (eventId) {

        const index = user.planner.findIndex(

            item => item.id == eventId

        );

        plannerEvent.id = Number(eventId);

        user.planner[index] = plannerEvent;

    }

    else {

        user.planner.push(plannerEvent);

    }

    updateCurrentUser(user);

    closePlannerModal();

    renderCalendar();

}


/* ==========================
        DELETE EVENT
========================== */

function deletePlannerEvent() {

    const user = getCurrentUser();

    if (!user) return;

    const eventId = Number(

        document.getElementById("event-id").value

    );

    user.planner = user.planner.filter(

        event => event.id !== eventId

    );

    updateCurrentUser(user);

    closePlannerModal();

    renderCalendar();

}