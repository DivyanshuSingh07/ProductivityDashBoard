/* ==========================
        PLANNER STATE
========================== */

let currentDate = new Date();

let currentMonth = currentDate.getMonth();

let currentYear = currentDate.getFullYear();

let selectedPlannerDate = null;

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

  renderDayPlanner();

  const plannerForm = document.getElementById("planner-form");

  if (plannerForm) {
    plannerForm.addEventListener("submit", savePlannerEvent);
  }

  const deleteBtn = document.getElementById("delete-event");

  if (deleteBtn) {
    deleteBtn.addEventListener("click", deletePlannerEvent);
  }

  const backBtn = document.getElementById("back-calendar");

  if (backBtn) {
    backBtn.addEventListener("click", closeDayPlanner);
  }
  const customBtn = document.getElementById("custom-event-btn");

  if (customBtn) {
    customBtn.addEventListener("click", () => {
      document.getElementById("planner-form").reset();

      document.getElementById("event-id").value = "";

      document.getElementById("selected-date").value = selectedPlannerDate;

      document.getElementById("planner-modal-title").textContent = "Add Event";

      document.getElementById("delete-event").classList.add("hidden");

      openPlannerModal();
    });
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

  const date = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const hasEvent = user.planner.some((event) => event.date === date);

  if (!hasEvent) return;

  const dot = document.createElement("span");

  dot.className = "planner-dot";

  cell.appendChild(dot);
}

/* ==========================
        SELECT DATE
========================== */

function selectDate(day, cell) {
  document.querySelectorAll(".calendar-day").forEach((item) => {
    item.classList.remove("selected");
  });

  cell.classList.add("selected");

  selectedPlannerDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  document.getElementById("selected-date").value = selectedPlannerDate;

  document.querySelector(".planner-container").classList.add("hidden");

  document.getElementById("day-planner").classList.remove("hidden");

  const date = new Date(selectedPlannerDate);

  document.getElementById("selected-day-title").textContent =
    date.toDateString();

  renderDayPlanner();
}
/* ==========================
        LOAD EVENT
========================== */

function loadPlannerEvent(date) {
  const user = getCurrentUser();

  if (!user) return;

  const event = user.planner.find((item) => item.date === date);

  document.getElementById("planner-form").reset();

  document.getElementById("selected-date").value = date;

  if (!event) {
    document.getElementById("event-id").value = "";

    document.getElementById("planner-modal-title").textContent = "Add Event";

    document.getElementById("delete-event").classList.add("hidden");

    openPlannerModal();

    return;
  }

  document.getElementById("event-id").value = event.id;

  document.getElementById("event-title").value = event.title;

  document.getElementById("event-category").value = event.category;

  document.getElementById("event-time").value = event.time;

  document.getElementById("planner-modal-title").textContent = "Edit Event";

  document.getElementById("delete-event").classList.remove("hidden");

  openPlannerModal();
}

/* ==========================
        LOAD EVENT BY ID
========================== */

function loadPlannerEventById(eventId) {
  const user = getCurrentUser();

  if (!user) return;

  const event = user.planner.find((item) => item.id === eventId);

  if (!event) return;

  document.getElementById("planner-form").reset();

  document.getElementById("event-id").value = event.id;

  document.getElementById("selected-date").value = event.date;

  document.getElementById("event-title").value = event.title;

  document.getElementById("event-category").value = event.category;

  document.getElementById("event-time").value = event.time;

  document.getElementById("planner-modal-title").textContent = "Edit Event";

  document.getElementById("delete-event").classList.remove("hidden");

  openPlannerModal();
}

/* ==========================
        SAVE EVENT
========================== */

function savePlannerEvent(event) {
  event.preventDefault();

  const user = getCurrentUser();

  if (!user) return;

  const title = document.getElementById("event-title").value.trim();

  if (title === "") {
    document.getElementById("event-title").focus();

    return;
  }

  const plannerEvent = {
    id: generateId(),

    title: title,

    category: document.getElementById("event-category").value,

    time: document.getElementById("event-time").value,

    date: document.getElementById("selected-date").value,
  };

  const eventId = document.getElementById("event-id").value;

  if (eventId) {
    const index = user.planner.findIndex((item) => item.id == eventId);

    plannerEvent.id = Number(eventId);

    user.planner[index] = plannerEvent;
  } else {
    user.planner.push(plannerEvent);
  }

  updateCurrentUser(user);

  closePlannerModal();

  renderCalendar();

  renderDayPlanner();
}

/* ==========================
        DELETE EVENT
========================== */

function deletePlannerEvent() {
  const user = getCurrentUser();

  if (!user) return;

  const eventId = Number(document.getElementById("event-id").value);

  user.planner = user.planner.filter((event) => event.id !== eventId);

  updateCurrentUser(user);

  closePlannerModal();

  renderCalendar();

  renderDayPlanner();
}

function renderDayPlanner() {
  const container = document.getElementById("timeline-container");

  const user = getCurrentUser();

  const events = user
    ? user.planner.filter((event) => event.date === selectedPlannerDate)
    : [];

  container.innerHTML = "";

  for (let hour = 0; hour < 24; hour++) {
    const slot = document.createElement("div");

    slot.className = "time-slot";

    slot.innerHTML = `

            <div class="slot-time">

                ${String(hour).padStart(2, "0")}:00

            </div>

            <div class="slot-content">

            </div>

        `;
    const hourEvents = events

      .filter((event) => Number(event.time.split(":")[0]) === hour)

      .sort((a, b) => a.time.localeCompare(b.time));

    hourEvents.forEach((event) => {
      const card = document.createElement("div");

      card.className = "planner-event";

      card.style.borderLeft = `6px solid ${getCategoryColor(event.category)}`;

      card.innerHTML = `

    <div class="planner-event-top">

        <h4>${event.title}</h4>

        <span
    class="planner-category"
    style="background:${getCategoryColor(event.category)}">

    ${event.category}

</span>

    </div>

    <div class="planner-event-bottom">

        <span>
            <i class="ri-time-line"></i>
            ${event.time}
        </span>

    </div>

`;

      card.addEventListener(
        "click",

        (e) => {
          e.stopPropagation();

          loadPlannerEventById(event.id);
        },
      );

      slot.querySelector(".slot-content").appendChild(card);
    });

    slot.addEventListener("click", () => {
      loadPlannerEventAtHour(hour);
    });
    container.appendChild(slot);
  }
}

function showCalendar() {
  document.querySelector(".planner-container").classList.remove("hidden");

  document.getElementById("day-planner").classList.add("hidden");
}

function closeDayPlanner() {
  document.getElementById("day-planner").classList.add("hidden");

  document.querySelector(".planner-container").classList.remove("hidden");
}

function loadPlannerEventAtHour(hour) {
  document.getElementById("planner-form").reset();

  document.getElementById("selected-date").value = selectedPlannerDate;

  document.getElementById("event-time").value =
    `${String(hour).padStart(2, "0")}:00`;

  document.getElementById("event-id").value = "";

  document.getElementById("delete-event").classList.add("hidden");

  document.getElementById("planner-modal-title").textContent = "Add Event";

  openPlannerModal();
}

function getCategoryColor(category) {
  switch (category) {
    case "Work":
      return "#2563eb";

    case "Study":
      return "#7c3aed";

    case "Health":
      return "#16a34a";

    case "Shopping":
      return "#f59e0b";

    case "Personal":
      return "#ec4899";

    default:
      return "#64748b";
  }
}
