// grab form element
const form = document.getElementById("profileForm");
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const formError = document.getElementById("formError");

// grab user input fields
const nameInput = document.getElementById("nameinput");
const emailInput = document.getElementById("emailinput");
const colorInput = document.getElementById("fcolorinput");

// grab profile display fields
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileColor = document.getElementById("profileColor");
// task list buttons and form
const taskForm = document.getElementById("taskForm");
const taskTitleInput = document.getElementById("taskTitle");
const taskCategoryInput = document.getElementById("taskCategory");
const taskList = document.getElementById("taskList");
const sortTasksButton = document.getElementById("sortTasksButton");
const clearTasksButton = document.getElementById("clearTasksButton");
const tasks = [];
let savedTasksJson = "";

const saveJsonButton = document.getElementById("saveJsonButton");
const loadJsonButton = document.getElementById("loadJsonButton");

// API section elements
const loadUsersButton = document.getElementById("loadUsersButton");
const clearUsersButton = document.getElementById("clearUsersButton");
const apiMessage = document.getElementById("apiMessage");
const userContainer = document.getElementById("userContainer");
// function and closure for vars
function createProfileManager() {
let profile= {
  name: "",
  email: "",
  color: ""
};
function saveProfile(name, email, color){
  profile.name = name;
  profile.email = email;
  profile.color = color;
}

function getProfile() {
  return profile;
}
return {
  saveProfile,
  getProfile
};
}
// profile manager/updater
const ProfileManager = createProfileManager();

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${task.title} - ${task.category}`;
    taskList.appendChild(listItem);
  });
}

// update profile text when form is submitted
form.addEventListener("submit", (event) => {
  event.preventDefault();

  nameError.textContent = "";
  emailError.textContent = "";
  formError.textContent = "";

  if (nameInput.value.trim() === "" && emailInput.value.trim() === "") {
    formError.textContent = "Please enter your name and email.";
    return;
  }

  if (nameInput.value.trim() === "") {
    nameError.textContent = "Please enter your name.";
  }

  if (emailInput.value.trim() === "") {
    emailError.textContent = "Please enter your email.";
  }

  if (nameError.textContent !== "" || emailError.textContent !== "") {
    return;
  }

  ProfileManager.saveProfile(
    nameInput.value,
    emailInput.value,
    colorInput.value
  );

  const savedProfile = ProfileManager.getProfile();

  profileName.textContent = savedProfile.name;
  profileEmail.textContent = savedProfile.email;
  profileColor.textContent = `Favorite Color: ${savedProfile.color}`;
  profileColor.style.color = savedProfile.color;
});
// renders tasks to page + clear button function and sort
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = taskTitleInput.value.trim();
  const category = taskCategoryInput.value.trim();

  if (title === "" && category === "") {
    return;
  }

  const newTask = {
    title: title,
    category: category
  };

  tasks.push(newTask);
  renderTasks();

  taskTitleInput.value = "";
  taskCategoryInput.value = "";
});

sortTasksButton.addEventListener("click", () => {
  tasks.sort((a, b) => a.title.localeCompare(b.title));
  renderTasks();
});

clearTasksButton.addEventListener("click", () => {
  tasks.length = 0;
  renderTasks();
});
// JSON creation / loading 
saveJsonButton.addEventListener("click", () => {
  savedTasksJson = JSON.stringify(tasks);
  apiMessage.textContent = "Task list saved as JSON.";
  console.log(savedTasksJson);
});

loadJsonButton.addEventListener("click", () => {
  if (savedTasksJson === "") {
    apiMessage.textContent = "No saved JSON to load yet.";
    return;
  }

  tasks.length = 0;
  tasks.push(...JSON.parse(savedTasksJson));
  renderTasks();
  apiMessage.textContent = "Saved JSON loaded.";
});

// Fetch items from the local API and display them on the dashboard
async function loadUsers() {
  apiMessage.textContent = "Loading item data...";
  userContainer.innerHTML = "";

  try {
    const response = await fetch("/api/items");

    if (!response.ok) {
      throw new Error("Could not fetch items.");
    }

    const data = await response.json();

    if (data.items.length === 0) {
      apiMessage.textContent = "No results found.";
      return;
    }

    apiMessage.textContent = data.message;

    data.items.forEach((item) => {
      const userCard = document.createElement("div");
      userCard.classList.add("user-card");

      userCard.innerHTML = `
        <h3>${item.title}</h3>
        <p><strong>Category:</strong> ${item.category}</p>
      `;

      userContainer.appendChild(userCard);
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    if (window.location.protocol === "file:") {
      apiMessage.textContent =
        "Start the Express server with npm start, then open http://localhost:3000/ to load API items.";
      return;
    }

    apiMessage.textContent = "Unable to load item data. Please try again.";
  }
}

// Load users button
loadUsersButton.addEventListener("click", () => {
  loadUsers();
});

// Clear displayed users
clearUsersButton.addEventListener("click", () => {
  userContainer.innerHTML = "";
  apiMessage.textContent = "Item list cleared.";
});
