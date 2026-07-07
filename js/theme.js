/* ==========================
        INITIALIZE THEME
========================== */

function initializeTheme() {

    const user = getCurrentUser();

    if (!user) return;

    applyTheme(user.theme || "light");

    const themeButton = document.getElementById("theme-toggle");

    themeButton.addEventListener("click", () => {

        const updatedUser = getCurrentUser();

        updatedUser.theme =
            updatedUser.theme === "dark"
            ? "light"
            : "dark";

        updateCurrentUser(updatedUser);

        applyTheme(updatedUser.theme);

    });

}

/* ==========================
        APPLY THEME
========================== */

function applyTheme(theme) {

    document.body.dataset.theme = theme;

    const icon = document.querySelector("#theme-toggle i");

    if (!icon) return;

    if (theme === "dark") {

        icon.className = "ri-sun-line";

    }

    else {

        icon.className = "ri-moon-line";

    }

}