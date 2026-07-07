/* ==========================
   LOCAL STORAGE KEYS
========================== */

const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

/* ==========================
   USERS
========================== */

function getUsers() {

    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];

}

function saveUsers(users) {

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );

}

/* ==========================
   CURRENT USER
========================== */

function getCurrentUser() {

    const session = JSON.parse(
        localStorage.getItem(CURRENT_USER_KEY)
    );

    if (!session) return null;

    const users = getUsers();

    return users.find(user => user.id === session.id) || null;

}

function saveCurrentUser(userId) {

    localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify({
            id: userId
        })
    );

}

function logoutUser() {

    localStorage.removeItem(CURRENT_USER_KEY);

}

/* ==========================
   UPDATE USER
========================== */

function updateCurrentUser(updatedUser) {

    const users = getUsers();

    const index = users.findIndex(
        user => user.id === updatedUser.id
    );

    if (index === -1) return;

    users[index] = {
    ...users[index],
    ...updatedUser
    };

    saveUsers(users);

}

/* ==========================
   AUTH GUARD
========================== */

function requireLogin(redirectPath = "./auth.html") {

    const user = getCurrentUser();

    if (!user) {

        window.location.href = redirectPath;

    }

}

/* ==========================
   GENERATE UNIQUE ID
========================== */

function generateId() {

    return Date.now() + Math.floor(Math.random() * 1000);

}


function isLoggedIn() {

    return getCurrentUser() !== null;

}