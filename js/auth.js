/* ==========================
   SELECT ELEMENTS
========================== */

const loginTab = document.getElementById("login-tab");
const registerTab = document.getElementById("register-tab");

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");

const authMessage = document.getElementById("auth-message");

/* ==========================
   TAB SWITCHING
========================== */

loginTab.addEventListener("click", () => {
  loginTab.classList.add("active");
  registerTab.classList.remove("active");

  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
});

registerTab.addEventListener("click", () => {
  registerTab.classList.add("active");
  loginTab.classList.remove("active");

  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
});

/* ==========================
   PASSWORD TOGGLE
========================== */

togglePassword("login-password", "login-password-toggle");
togglePassword("password", "register-password-toggle");
togglePassword("confirm-password", "confirm-password-toggle");

function togglePassword(inputId, buttonId) {
  const input = document.getElementById(inputId);
  const button = document.getElementById(buttonId);

  button.addEventListener("click", () => {
    if (input.type === "password") {
      input.type = "text";
      button.innerHTML = '<i class="ri-eye-off-line"></i>';
    } else {
      input.type = "password";
      button.innerHTML = '<i class="ri-eye-line"></i>';
    }
  });
}

/* ==========================
   HELPERS
========================== */

function showMessage(message, type) {
  authMessage.textContent = message;

  authMessage.className = `auth-message ${type}`;

  setTimeout(() => {
    authMessage.className = "auth-message";
    authMessage.textContent = "";
  }, 3000);
}

function clearErrors(form) {
  form.querySelectorAll(".error-message").forEach((error) => {
    error.textContent = "";
  });
}

function setError(input, message) {
  const error = input.closest(".form-group").querySelector(".error-message");

  error.textContent = message;
}

/* ==========================
   REGISTER
========================== */

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  registerBtn.disabled = true;
  registerBtn.textContent = "Creating...";

  clearErrors(registerForm);

  const fullName = document.getElementById("full-name");
  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirm = document.getElementById("confirm-password");

  const fullNameValue = fullName.value.trim().replace(/\s+/g, " ");

  const usernameValue = username.value.trim().toLowerCase();

  const emailValue = email.value.trim().toLowerCase();

  const passwordValue = password.value;

  const confirmValue = confirm.value;

  let valid = true;

  /* ---------- FULL NAME ---------- */

  if (fullNameValue === "") {
    setError(fullName, "Full Name is required.");
    valid = false;
  } else if (fullNameValue.length < 3) {
    setError(fullName, "Minimum 3 characters required.");
    valid = false;
  } else if (fullNameValue.length > 50) {
    setError(fullName, "Maximum 50 characters allowed.");
    valid = false;
  }

  /* ---------- USERNAME ---------- */

  const usernameRegex = /^[A-Za-z0-9_]+$/;

  if (usernameValue === "") {
    setError(username, "Username is required.");
    valid = false;
  } else if (usernameValue.length < 3) {
    setError(username, "Minimum 3 characters required.");
    valid = false;
  } else if (usernameValue.length > 20) {
    setError(username, "Maximum 20 characters allowed.");
    valid = false;
  } else if (!usernameRegex.test(usernameValue)) {
    setError(username, "Only letters, numbers and underscore are allowed.");

    valid = false;
  }

  /* ---------- EMAIL ---------- */

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailValue === "") {
    setError(email, "Email is required.");
    valid = false;
  } else if (!emailRegex.test(emailValue)) {
    setError(email, "Enter a valid email.");
    valid = false;
  }

  /* ---------- PASSWORD ---------- */

  if (passwordValue === "") {
    setError(password, "Password is required.");
    valid = false;
  } else if (passwordValue.length < 8) {
    setError(password, "Password must be at least 8 characters.");
    valid = false;
  }

  /* ---------- CONFIRM PASSWORD ---------- */

  if (confirmValue === "") {
    setError(confirm, "Please confirm your password.");
    valid = false;
  } else if (passwordValue !== confirmValue) {
    setError(confirm, "Passwords do not match.");
    valid = false;
  }

  const users = getUsers();

  /* ---------- DUPLICATE USERNAME ---------- */

  const usernameExists = users.some(
    (user) => user.username.toLowerCase() === usernameValue,
  );

  if (usernameExists) {
    setError(username, "Username already exists.");
    valid = false;
  }

  /* ---------- DUPLICATE EMAIL ---------- */

  const emailExists = users.some(
    (user) => user.email.toLowerCase() === emailValue,
  );

  if (emailExists) {
    setError(email, "Email already registered.");
    valid = false;
  }

  if (!valid) {
    registerBtn.disabled = false;
    registerBtn.textContent = "Create Account";

    return;
  }

//   const newUser = {
//     id: Date.now(),

//     fullName: fullNameValue,

//     username: usernameValue,

//     email: emailValue,

//     password: passwordValue,

//     theme: "light",
    
//     dashboardTheme: "auto",

//     heroSettings: {

//     mode: "auto",

//     theme: null,

//     animation: "auto",

//     wallpaper: "",

//     slideshow: false,

//     slideshowInterval: 10000,

//     slideshowImages: [],

//     customThemes: []

// },

//     profileImage: "",

//     createdAt: new Date().toISOString(),

//     todos: [],

//     planner: [],

//     goals: [],

//     favoriteQuotes: [],

//     pomodoro: {
//       sessions: 0,

//       focusMinutes: 0,

//       streak: 0,

//       completed: 0,

//       started: 0,

//       focus: 25,

//       shortBreak: 5,

//       longBreak: 15,
//     },

//     weather: {
//       city: "",

//       temperature: null,

//       description: "",

//       updatedAt: null,
//     },

//     dailyGoals: [],
//     habits: [],
//     categories: [],
//     lifeGoals: [],
//     bucketList: [],
//     reflections: [],
//     achievements: [],
//   };

const newUser = {

    id: Date.now(),

    fullName: fullNameValue,

    username: usernameValue,

    email: emailValue,

    password: passwordValue,

    theme: "light",

    profileImage: "",

    createdAt: new Date().toISOString(),

   heroSettings:{

    mode:"auto",

    selectedTheme:null,

    selectedWallpaper:null,

    animation:null,

    slideshow:false,

    slideshowInterval:10000,

    uploadedWallpapers:[],

    customThemes:[]

},

    todos:[],

    planner:[],

    goals:[],

    favoriteQuotes:[],

    pomodoro:{
        sessions:0,
        focusMinutes:0,
        streak:0,
        completed:0,
        started:0,
        focus:25,
        shortBreak:5,
        longBreak:15
    },

    // weather:{
    //     city:"",
    //     temperature:null,
    //     description:"",
    //     updatedAt:null
    // },

weather:{

    city:"",

    temperature:null,

    description:"",

    feelsLike:null,

    humidity:null,

    wind:null,

    visibility:null,

    pressure:null,

    weatherCode:null,
    
    isDay: null,

    sunrise: null,

    sunset: null,

    updatedAt:null

},
    dailyGoals:[],
    habits:[],
    categories:[],
    lifeGoals:[],
    bucketList:[],
    reflections:[],
    achievements:[]
};

  users.push(newUser);

  saveUsers(users);

  registerForm.reset();

  registerBtn.disabled = false;
  registerBtn.textContent = "Create Account";

  showMessage("Account created successfully! Please login.", "success");

  loginTab.click();
});

/* ==========================
   LOGIN
========================== */

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  loginBtn.disabled = true;
  loginBtn.textContent = "Logging In...";

  clearErrors(loginForm);

  const identifier = document.getElementById("login-identifier");
  const password = document.getElementById("login-password");

  const identifierValue = identifier.value.trim().toLowerCase();

  const passwordValue = password.value;

  /* ---------- EMPTY VALIDATION ---------- */

  if (identifierValue === "") {
    setError(identifier, "Username or Email is required.");

    loginBtn.disabled = false;
    loginBtn.textContent = "Login";

    return;
  }

  if (passwordValue === "") {
    setError(password, "Password is required.");

    loginBtn.disabled = false;
    loginBtn.textContent = "Login";

    return;
  }

  /* ---------- FIND USER ---------- */

  const users = getUsers();

  const user = users.find(
    (user) =>
      user.username.toLowerCase() === identifierValue ||
      user.email.toLowerCase() === identifierValue,
  );

  if (!user) {
    setError(identifier, "No account found. Please create an account first.");

    loginBtn.disabled = false;
    loginBtn.textContent = "Login";

    return;
  }

  /* ---------- PASSWORD CHECK ---------- */

  if (user.password !== passwordValue) {
    setError(password, "Incorrect password.");

    loginBtn.disabled = false;
    loginBtn.textContent = "Login";

    return;
  }

  /* ---------- SAVE SESSION ---------- */

  saveCurrentUser(user.id);

  showMessage(`Welcome back, ${user.fullName}!`, "success");

  setTimeout(() => {
    window.location.href = "./";
  }, 800);
});

/* ==========================
   AUTO LOGIN
========================== */

const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));

if (currentUser) {
  const users = getUsers();

  const loggedInUser = users.find((user) => user.id === currentUser.id);

  if (loggedInUser) {
    window.location.href = "./";
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

/* ==========================
   CLEAR ERRORS ON INPUT
========================== */

document.querySelectorAll(".form-input").forEach((input) => {
  input.addEventListener("input", () => {
    const error = input.closest(".form-group").querySelector(".error-message");

    error.textContent = "";
  });
});

/* ==========================
   OPTIONAL: ENTER KEY SUPPORT
========================== */

document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;

  if (!loginForm.classList.contains("hidden")) {
    loginBtn.click();
  }

  if (!registerForm.classList.contains("hidden")) {
    registerBtn.click();
  }
});
