/* ==========================
        TIMER STATE
========================== */

let timer = null;

let timerRunning = false;

let remainingSeconds = 1500;

let currentDuration = 1500;

let progressCircle = null;

let sessionStarted = false;

const radius = 180;

const circumference = 2 * Math.PI * radius;


/* ==========================
        INITIALIZE TIMER
========================== */

function initializePomodoro() {

    const startBtn = document.getElementById("start-timer");

    const pauseBtn = document.getElementById("pause-timer");

    const resetBtn = document.getElementById("reset-timer");

    const workBtn = document.getElementById("work-mode");

    const shortBtn = document.getElementById("short-break");

    const longBtn = document.getElementById("long-break");

    progressCircle = document.getElementById("progress-circle");

    if (progressCircle) {

        progressCircle.style.strokeDasharray = circumference;

        progressCircle.style.strokeDashoffset = 0;

    }

    if (startBtn) {

        startBtn.addEventListener("click", startTimer);

    }

    if (pauseBtn) {

        pauseBtn.addEventListener("click", pauseTimer);

    }

    if (resetBtn) {

        resetBtn.addEventListener("click", resetTimer);

    }

    if (workBtn) {

        workBtn.addEventListener("click", () => switchMode(25));

    }

    if (shortBtn) {

        shortBtn.addEventListener("click", () => switchMode(5));

    }

    if (longBtn) {

        longBtn.addEventListener("click", () => switchMode(15));

    }

    updateTimerDisplay();

    updateProgressRing();

    updatePomodoroStats();

}


/* ==========================
        TIMER DISPLAY
========================== */

function updateTimerDisplay() {

    const minutes = Math.floor(

        remainingSeconds / 60

    );

    const seconds = remainingSeconds % 60;

    document.getElementById("timer-display").textContent =

        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


/* ==========================
        START TIMER
========================== */

/* ==========================
        START TIMER
========================== */

function startTimer() {

    if (timerRunning) return;

    timerRunning = true;

    const mode =
        document.querySelector(".mode-btn.active").dataset.mode;

    if (mode === "work") {

        const user = getCurrentUser();

        if (!sessionStarted) {

            user.pomodoro.started++;

            sessionStarted = true;

            updateCurrentUser(user);

            updatePomodoroStats();

        }

    }

    document
        .querySelector(".timer-wrapper")
        .classList.add("running");

    // Decrease immediately
    tick();

    timer = setInterval(tick, 1000);

}

function tick() {

    remainingSeconds = Math.max(
        remainingSeconds - 1,
        0
    );

    updateTimerDisplay();

    updateProgressRing();

    if (remainingSeconds === 0) {

        clearInterval(timer);

        timerRunning = false;

        document
            .querySelector(".timer-wrapper")
            .classList.remove("running");

        timerCompleted();

    }

}

/* ==========================
        PAUSE TIMER
========================== */

function pauseTimer() {

    clearInterval(timer);

    timerRunning = false;

    document
        .querySelector(".timer-wrapper")
        .classList.remove("running");

}


/* ==========================
        RESET TIMER
========================== */

function resetTimer() {

    sessionStarted = false;

    pauseTimer();

    remainingSeconds = currentDuration;

    updateTimerDisplay();

    updateProgressRing();

}


/* ==========================
        SWITCH MODE
========================== */

function switchMode(minutes) {

    if (timerRunning) {

        showToast(
            "Pause or reset the timer before changing mode.",
            "error"
        );

        return;

    }

    sessionStarted = false;

    pauseTimer();

    currentDuration = minutes * 60;

    remainingSeconds = currentDuration;

    updateTimerDisplay();

    updateProgressRing();

    document
        .querySelectorAll(".mode-btn")
        .forEach(btn => {

            btn.classList.remove("active");

        });

    if (minutes === 25) {

        document
            .getElementById("work-mode")
            .classList.add("active");

    }

    else if (minutes === 5) {

        document
            .getElementById("short-break")
            .classList.add("active");

    }

    else {

        document
            .getElementById("long-break")
            .classList.add("active");

    }

    const modeText =
        document.getElementById("timer-mode");

    if (minutes === 25) {

        modeText.textContent = "WORK SESSION";

    }

    else if (minutes === 5) {

        modeText.textContent = "SHORT BREAK";

    }

    else {

        modeText.textContent = "LONG BREAK";

    }

}


/* ==========================
        PROGRESS RING
========================== */

function updateProgressRing() {

    if (!progressCircle) return;

    const progress =
currentDuration > 0
    ? remainingSeconds / currentDuration
    : 0;

    progressCircle.style.strokeDashoffset =

        circumference * (1 - progress);

}


/* ==========================
        TIMER COMPLETED
========================== */

function timerCompleted() {

    clearInterval(timer);
    timer = null;

    timerRunning = false;

    document
        .querySelector(".timer-wrapper")
        .classList.remove("running");

    const user = getCurrentUser();

    if (!user) return;

    const mode =
        document.querySelector(".mode-btn.active").dataset.mode;

    if (mode === "work") {

        user.pomodoro.sessions++;
        user.pomodoro.focusMinutes += 25;
        user.pomodoro.completed++;
        user.pomodoro.streak++;

        showToast(
            "🎉 Work session completed!"
        );

    }

    else if (mode === "short") {

        showToast(
            "☕ Short break finished!"
        );

    }

    else {

        showToast(
            "🌴 Long break finished!"
        );

    }

    updateCurrentUser(user);

    updatePomodoroStats();

    sessionStarted = false;

}

/* ==========================
        UPDATE STATS
========================== */

function updatePomodoroStats() {

    const user = getCurrentUser();

    if (!user) return;

    document.getElementById("today-sessions").textContent =
        user.pomodoro.sessions;

    document.getElementById("today-focus").textContent =
        `${user.pomodoro.focusMinutes} min`;

    document.getElementById("today-streak").textContent =
        `🔥 ${user.pomodoro.streak}`;

    let percentage = 0;

    if (user.pomodoro.started > 0) {

        percentage = Math.round(

            (user.pomodoro.completed /
            user.pomodoro.started) * 100

        );

    }

    document.getElementById("today-complete").textContent =
        `${percentage}%`;

}

