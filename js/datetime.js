/* ==========================
        INITIALIZE DATE & TIME
========================== */

function initializeDateTime() {

    updateGreeting();

    updateDate();

    setInterval(() => {

        updateGreeting();

        updateDate();

    }, 60000);

}

/* ==========================
        GREETING
========================== */

function updateGreeting() {

    const greeting = document.getElementById("greeting");

    if (!greeting) return;

    const user = getCurrentUser();

    const name = user ? user.fullName.split(" ")[0] : "User";

    const hour = new Date().getHours();

    let message = "";

    if (hour < 12) {

        message = "Good Morning";

    }

    else if (hour < 17) {

        message = "Good Afternoon";

    }

    else {

        message = "Good Evening";

    }

    greeting.textContent = `${message}, ${name}`;

}

/* ==========================
        DATE
========================== */

// function updateDate() {

//     const dateElement = document.getElementById("current-date");

//     if (!dateElement) return;

//     const today = new Date();

//     const options = {

//         weekday: "long",
//         day: "numeric",
//         month: "long",
//         year: "numeric"

//     };

//     dateElement.textContent =
//         today.toLocaleDateString("en-IN", options);

// }

function updateDate() {
    const dateElement = document.getElementById("current-date");
    if (!dateElement) return;

    const today = new Date();

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",      // Adds hours (e.g., "02" or "14")
        minute: "2-digit",    // Adds minutes (e.g., "45")
        second: "2-digit",    // Adds seconds (e.g., "09")
        hour12: false          // Uses 24-hour format (AM/PM). Set to true for 12-hour format.
    };

    // "en-IN" will format it beautifully (e.g., "Tuesday, 14 July 2026, 02:45:09 pm")
    dateElement.textContent = today.toLocaleDateString("en-IN", options);
}

// Run the function once immediately so there is no 1-second delay on page load
updateDate();

// Update the date and time every 1000 milliseconds (1 second)
setInterval(updateDate, 1000);