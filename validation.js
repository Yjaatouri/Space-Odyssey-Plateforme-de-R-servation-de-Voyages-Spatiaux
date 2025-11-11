// ===============================
// SpaceVoyager Login System (with users.json)
// ===============================

const form = document.querySelector("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Regex patterns
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()[\]{}<>~])[A-Za-z\d@$!%*?&#^()[\]{}<>~]{8,}$/;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  let valid = true;

  // Validate email
  if (!emailRegex.test(email)) {
    showError(emailInput, "Invalid email format (example@mail.com)");
    valid = false;
  } else {
    clearError(emailInput);
  }

  // Validate password
  if (!passwordRegex.test(password)) {
    showError(
      passwordInput,
      "Password must be 8+ chars, with uppercase, lowercase, number, and symbol."
    );
    valid = false;
  } else {
    clearError(passwordInput);
  }

  if (!valid) return;

  // Load users from JSON file
  try {
    const res = await fetch("users.json");
    const users = await res.json();

    // Check if user exists
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // Save logged user in localStorage
      localStorage.setItem("loggedUser", JSON.stringify(user));

      alert(" Welcome back, " + email + "!");
      window.location.href = "index.html"; // redirect to homepage
    } else {
      alert(" Invalid email or password!");
    }
  } catch (err) {
    console.error("Error loading users.json:", err);
    alert(" Could not load user data. Make sure users.json exists.");
  }
});

// Helper functions
function showError(input, message) {
  clearError(input);
  const error = document.createElement("p");
  error.className = "text-red-400 text-sm mt-2 animate-pulse";
  error.textContent = message;
  input.insertAdjacentElement("afterend", error);
  input.classList.add("border-red-500");
}

function clearError(input) {
  input.classList.remove("border-red-500");
  const next = input.nextElementSibling;
  if (next && next.classList.contains("text-red-400")) {
    next.remove();
  }
}
