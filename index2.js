const user = JSON.parse(localStorage.getItem("loggedUser"));
const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
const navLogin = document.getElementById("nav-login");


if (user) {
  const welcome = document.createElement("p");
  welcome.className = "text-neon-blue font-orbitron mt-4 text-center";
  welcome.textContent = ` Welcome, ${user.email}!`;
  document.body.prepend(welcome);
}

// logged out
// ===============================
// SpaceVoyager - User Session System
// ===============================

// Get the logged user from localStorage


// If no user → redirect to login page
if (user) {
  // Display welcome message
  const header = document.createElement("div");
  header.className = "text-center mt-6";

  const welcome = document.createElement("p");
  welcome.className = "text-neon-blue font-orbitron text-xl mb-4";


  const logoutBtn = document.createElement("button");
  logoutBtn.textContent = "Logout";
  logoutBtn.className =
    "bg-gradient-to-r from-neon-blue to-neon-purple text-white px-6 py-2 rounded-lg font-bold glow hover:opacity-90 transition";

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedUser"); // remove session
    alert(" You have been logged out!");
    window.location.href = "login.html"; // redirect back
  });

  header.appendChild(welcome);
  header.appendChild(logoutBtn);
  document.body.prepend(header);
}
if (loggedUser && navLogin) {
    navLogin.remove();
}
