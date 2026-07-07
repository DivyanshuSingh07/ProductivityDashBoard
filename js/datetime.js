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

function updateDate() {

    const dateElement = document.getElementById("current-date");

    if (!dateElement) return;

    const today = new Date();

    const options = {

        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"

    };

    dateElement.textContent =
        today.toLocaleDateString("en-IN", options);

}