/* ==========================
        APP INITIALIZATION
========================== */

document.addEventListener("DOMContentLoaded", initializeApp);

/* ==========================
        INITIALIZE APP
========================== */

function initializeApp() {

    requireLogin("./auth.html");

    loadCurrentUser();

    initializeNavigation();

    initializeDateTime();

    initializeTheme();

    initializeModal();

    initializeTodo();

    initializePlanner();

    initializeGoals();

    initializePomodoro();

    initializeQuotes();

    initializeLogout();

}

/* ==========================
        LOAD USER
========================== */

function loadCurrentUser() {

    const user = getCurrentUser();

    if (!user) return;

    const userName = document.getElementById("user-name");

    if (userName) {

        userName.textContent = user.fullName;

    }

}

/* ==========================
        LOGOUT
========================== */

function initializeLogout() {

    const logoutBtn = document.getElementById("logout-btn");

    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", () => {

        const confirmLogout = confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmLogout) return;

        logoutUser();

        window.location.href = "./auth.html";

    });

}