// booking.js – FULLY FIXED VERSION
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'space-dark': '#0a0a18',
        'space-blue': '#1a1a2e',
        'space-purple': '#16213e',
        'neon-blue': '#0ea5e9',
        'neon-purple': '#8b5cf6',
        'neon-cyan': '#06b6d4',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        exo: ['Exo 2', 'sans-serif'],
      },
    }
  }
};

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

let accommodationsData = [];
let destinationsData = [];
let passengerCount = 1;
let maxPassengers = 1;

// Create stars
function createStars() {
  const container = document.getElementById("stars-container");
  if (!container) return;
  for (let i = 0; i < 120; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDelay = Math.random() * 5 + "s";
    container.appendChild(star);
  }
}

// Mobile menu toggle (critical!)
document.addEventListener("DOMContentLoaded", () => {
  const mobileBtn = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  createStars();
  loadAccommodations();
  loadDestinations();
  updateMaxPassengers();

  // Validation
  document.querySelectorAll("[data-validation]").forEach(attachValidation);
  document.querySelectorAll('input[name="passengers"]').forEach(r =>
    r.addEventListener("change", updateMaxPassengers)
  );
  document.getElementById("add-passenger-btn")?.addEventListener("click", addPassengerForm);
});

// Load accommodations
async function loadAccommodations() {
  try {
    const res = await fetch("accommodations.json");
    const data = await res.json();
    accommodationsData = data.accommodations;

    const container = document.getElementById("accommodations-container");
    container.innerHTML = "";

    accommodationsData.forEach(acc => {
      const card = document.createElement("div");
      card.className = "p-4 rounded-lg border border-neon-blue/30 cursor-pointer hover:bg-neon-blue/10 transition";
      card.innerHTML = `
        <h3 class="font-orbitron text-neon-blue mb-2">${acc.name}</h3>
        <p class="text-sm text-gray-400">${acc.shortDescription}</p>
        <div class="mt-2 text-xs text-gray-500">$${acc.pricePerDay}/day</div>
      `;
      card.onclick = () => {
        document.getElementById("accommodation").value = acc.id;
        updateTotalPrice();
      };
      container.appendChild(card);
    });

    if (accommodationsData.length > 0) {
      document.getElementById("accommodation").value = accommodationsData[0].id;
    }
  } catch (err) {
    console.error("Failed to load accommodations:", err);
  }
}

// Load destinations
async function loadDestinations() {
  try {
    const res = await fetch("destinations.json");
    const data = await res.json();
    destinationsData = data.destinations;

    const select = document.getElementById("destination");
    select.innerHTML = '<option value="">Select your destination</option>';

    destinationsData.forEach(dest => {
      const opt = document.createElement("option");
      opt.value = dest.id;
      opt.textContent = dest.name;
      opt.setAttribute("data-destination", JSON.stringify(dest));
      select.appendChild(opt);
    });

    select.addEventListener("change", () => {
      const selected = select.options[select.selectedIndex];
      if (!selected.value) {
        document.getElementById("destination-info").classList.add("hidden");
        return;
      }
      const dest = JSON.parse(selected.getAttribute("data-destination"));

      document.getElementById("destination-name").textContent = dest.name;
      document.getElementById("destination-description").textContent = dest.description;
      document.getElementById("destination-duration").textContent = dest.duration;
      document.getElementById("destination-distance").textContent = dest.distance;
      document.getElementById("destination-gravity").textContent = dest.gravity;
      document.getElementById("destination-temperature").textContent = dest.temperature;
      document.getElementById("destination-price").textContent = `$${dest.price.toLocaleString()}`;
      document.getElementById("destination-info").classList.remove("hidden");

      updateTotalPrice();
    });
  } catch (err) {
    console.error("Failed to load destinations:", err);
  }
}

// Update total price
function updateTotalPrice() {
  const destinationSelect = document.getElementById("destination");
  const totalElem = document.getElementById("total-price-display");
  if (!destinationSelect.value) {
    totalElem.textContent = "";
    return;
  }

  const dest = JSON.parse(destinationSelect.selectedOptions[0].getAttribute("data-destination"));
  const basePrice = dest.price || 0;

  const accId = document.getElementById("accommodation").value;
  const acc = accommodationsData.find(a => a.id === accId);
  const accPrice = acc ? acc.pricePerDay : 0;

  const total = (basePrice + accPrice) * passengerCount;
  totalElem.textContent = `Total: $${total.toLocaleString()}`;
}

// Add passenger
function addPassengerForm() {
  if (passengerCount >= maxPassengers) return;
  passengerCount++;

  const container = document.getElementById("passenger-forms-container");
  const div = document.createElement("div");
  div.className = "passenger-form mt-8 relative";

  div.innerHTML = `
    <button type="button" class="remove-passenger-btn absolute top-0 right-0 -mt-2 -mr-2 w-8 h-8 rounded-full bg-red-600/80 hover:bg-red-700 text-white text-xs font-bold">×</button>
    <h3 class="font-orbitron text-neon-blue mb-4 pr-8">Passenger ${passengerCount}</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input type="text" placeholder="First Name" required data-validation="name" class="w-full h-12 rounded-md border border-gray-600 bg-space-dark/70 px-4 text-white">
      <input type="text" placeholder="Last Name" required data-validation="name" class="w-full h-12 rounded-md border border-gray-600 bg-space-dark/70 px-4 text-white">
      <input type="email" placeholder="Email" required data-validation="email" class="w-full h-12 rounded-md border border-gray-600 bg-space-dark/70 px-4 text-white">
      <input type="tel" placeholder="Phone" required data-validation="phone" class="w-full h-12 rounded-md border border-gray-600 bg-space-dark/70 px-4 text-white">
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
      ${" ".repeat(4)} <!-- placeholder -->
    </div>
  `;

  container.appendChild(div);
  div.querySelectorAll("[data-validation]").forEach(attachValidation);

  div.querySelector(".remove-passenger-btn").addEventListener("click", () => {
    div.remove();
    passengerCount--;
    renumberPassengerHeaders();
    updateTotalPrice();
  });

  updateTotalPrice();
}

function renumberPassengerHeaders() {
  document.querySelectorAll(".passenger-form").forEach((form, i) => {
    const header = form.querySelector("h3");
    if (header) header.textContent = i === 0 ? "Primary Passenger" : `Passenger ${i + 1}`;
  });
}

function updateMaxPassengers() {
  const type = document.querySelector('input[name="passengers"]:checked').value;
  maxPassengers = type === "solo" ? 1 : type === "couple" ? 2 : 6;

  const forms = document.querySelectorAll(".passenger-form");
  while (forms.length > maxPassengers) {
    forms[forms.length - 1].remove();
    passengerCount--;
  }
  updateTotalPrice();
}

// Validation
const patterns = {
  name: /^[A-Za-zÀ-ÿ\s'-]{2,30}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?\d{7,15}$/
};

function validateField(input) {
  const type = input.dataset.validation;
  const value = input.value.trim();
  const errorDiv = input.parentElement.querySelector(".error-message") || input.nextElementSibling;

  if (!value) {
    errorDiv.textContent = "Required";
    errorDiv.classList.remove("hidden");
    input.style.borderColor = "#ef4444";
    return false;
  }
  if (patterns[type] && !patterns[type].test(value)) {
    errorDiv.textContent = `Invalid ${type}`;
    errorDiv.classList.remove("hidden");
    input.style.borderColor = "#ef4444";
    return false;
  }
  errorDiv.classList.add("hidden");
  input.style.borderColor = "#22c55e";
  return true;
}

function attachValidation(input) {
  input.addEventListener("blur", () => validateField(input));
  input.addEventListener("input", () => validateField(input));
}

// Collect + Save Booking
function collectPassengerData() {
  const passengers = [];
  document.querySelectorAll(".passenger-form").forEach((form, i) => {
    const inputs = form.querySelectorAll("input");
    passengers.push({
      firstName: inputs[0].value.trim(),
      lastName: inputs[1].value.trim(),
      email: inputs[2].value.trim(),
      phone: inputs[3].value.trim(),
      isPrimary: i === 0
    });
  });
  return passengers;
}

function saveBooking(passengers) {
  const booking = {
    id: Date.now(),
    bookingDate: new Date().toISOString(),
    destination: document.getElementById("destination").selectedOptions[0].text,
    departureDate: document.getElementById("departure-date").value,
    passengers: passengers,
    totalPassengers: passengers.length
  };

  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  bookings.push(booking);
  localStorage.setItem("bookings", JSON.stringify(bookings));
}

// Submit
document.getElementById("booking-form").addEventListener("submit", function (e) {
  e.preventDefault();

  let valid = true;
  document.querySelectorAll("[data-validation], #destination, #departure-date").forEach(field => {
    if (!field.value.trim() || (field.dataset.validation && !validateField(field))) {
      valid = false;
    }
  });

  if (!valid) {
    alert("Please fix all errors before submitting.");
    return;
  }

  const passengers = collectPassengerData();
  saveBooking(passengers);

  alert("Booking Confirmed! Taking you to your receipt...");
  window.location.href = "Mbooking.html";
});

localStorage.setItem("loggedIn", "true");
document.addEventListener("DOMContentLoaded", () => {
    const loginLink = document.getElementById("nav-login");

    if (localStorage.getItem("loggedIn") === "true" && loginLink) {
        loginLink.remove();
    }

    // YOUR PAGE CODE HERE...
});
document.addEventListener("DOMContentLoaded", () => {

    // 🔥 REMOVE LOGIN FROM NAV IF USER LOGGED IN
    const loginLink = document.getElementById("nav-login");
    if (localStorage.getItem("loggedIn") === "true" && loginLink) {
        loginLink.remove();
    }

    // ⬇️ keep your original code here
    createStars();
    loadAccommodations();
    loadDestinations();
    updateMaxPassengers();
    document.querySelectorAll("[data-validation]").forEach(attachValidation);
    document.querySelectorAll('input[name="passengers"]').forEach(r =>
        r.addEventListener("change", updateMaxPassengers)
    );
    document.getElementById("add-passenger-btn")?.addEventListener("click", addPassengerForm);

});
