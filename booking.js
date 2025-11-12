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
        'orbitron': ['Orbitron', 'sans-serif'],
        'exo': ['Exo 2', 'sans-serif'],
      },
    }
  }
};

let accommodationsData = [];
let destinationsData = [];
let passengerCount = 1;
let maxPassengers = 1;

// creat stars
function createStars() {
  const container = document.getElementById("stars-container");
  for (let i = 0; i < 100; i++) {
    const s = document.createElement("div");
    s.classList.add("star");
    s.style.left = `${Math.random() * 100}%`;
    s.style.top = `${Math.random() * 100}%`;
    container.appendChild(s);
  }
}

// update total price
function updateTotalPrice() {
  const destinationSelect = document.getElementById("destination");
  const totalElem = document.getElementById("total-price-display");
  if (!destinationSelect.value) {
    totalElem.textContent = "";
    return;
  }

  const selectedOption = destinationSelect.options[destinationSelect.selectedIndex];
  const dest = JSON.parse(selectedOption.getAttribute("data-destination"));
  const basePrice = dest.price || 0;

  const accommodationId = document.getElementById("accommodation").value;
  const acc = accommodationsData.find(a => a.id === accommodationId);
  const accPrice = acc ? acc.pricePerDay : 0;

  const total = (basePrice + accPrice) * passengerCount;
  totalElem.textContent = `Total: $${total.toLocaleString()} ${dest.currency || ""}`;
}

// add passengers
function addPassengerForm() {
  if (passengerCount >= maxPassengers) return;
  passengerCount++;
  const container = document.getElementById("passenger-forms-container");
  const newDiv = document.createElement("div");
  newDiv.className = "passenger-form mt-6";
  newDiv.innerHTML = `
    <h3 class="font-orbitron text-neon-blue mb-2">Passenger ${passengerCount}</h3>
    ${createInput("First Name", "name")}
    ${createInput("Last Name", "name")}
    ${createInput("Email", "email")}
    ${createInput("Phone", "phone")}
  `;
  container.appendChild(newDiv);

  newDiv.querySelectorAll("[data-validation]").forEach(attachValidation);
  updateTotalPrice();
}

function createInput(placeholder, type) {
  return `
  <div class="mb-3">
    <input type="text" placeholder="${placeholder}" required data-validation="${type}"
      class="w-full h-12 rounded-md border border-gray-600 bg-space-dark/70 px-4 text-white focus:outline-none transition-colors duration-200" />
    <div class="error-message text-sm mt-1 text-red-400 hidden"></div>
  </div>`;
}
// passenger
function updateMaxPassengers() {
  const type = document.querySelector('input[name="passengers"]:checked').value;
  if (type === "solo") maxPassengers = 1;
  if (type === "couple") maxPassengers = 2;
  if (type === "group") maxPassengers = 6;

  const forms = document.querySelectorAll(".passenger-form");
  if (forms.length > maxPassengers) {
    for (let i = forms.length - 1; i >= maxPassengers; i--) forms[i].remove();
    passengerCount = maxPassengers;
  }
  updateTotalPrice();
}

// load acc
async function loadAccommodations() {
  const res = await fetch("accommodations.json");
  const data = await res.json();
  accommodationsData = data.accommodations;
}

// load distination
async function loadDestinations() {
  const res = await fetch("destinations.json");
  const data = await res.json();
  destinationsData = data.destinations;

  const select = document.getElementById("destination");
  destinationsData.forEach(dest => {
    const opt = document.createElement("option");
    opt.value = dest.id;
    opt.textContent = `${dest.name} — $${dest.price}`;
    opt.setAttribute("data-destination", JSON.stringify(dest));
    select.appendChild(opt);
  });

  select.addEventListener("change", function () {
    const selected = this.options[this.selectedIndex];
    const dest = JSON.parse(selected.getAttribute("data-destination"));
    document.getElementById("destination-name").textContent = dest.name;
    document.getElementById("destination-description").textContent = dest.description;
    document.getElementById("destination-duration").textContent = dest.travelDuration;
    document.getElementById("destination-distance").textContent = dest.distance;
    document.getElementById("destination-gravity").textContent = dest.gravity;
    document.getElementById("destination-temperature").textContent = dest.temperature;
    document.getElementById("destination-price").textContent = `$${dest.price} ${dest.currency || ""}`;
    document.getElementById("destination-info").classList.remove("hidden");
    showAccommodationsForDestination(dest);
    updateTotalPrice();
  });
}

// show acc
function showAccommodationsForDestination(dest) {
  const container = document.getElementById("accommodations-container");
  container.innerHTML = "";
  const available = accommodationsData.filter(a => dest.accommodations.includes(a.id));
  available.forEach(acc => {
    const card = document.createElement("div");
    card.className = "accommodation-card p-4 border border-neon-blue/30 rounded-md cursor-pointer hover:bg-neon-blue/10";
    card.innerHTML = `
      <h3 class="font-orbitron text-neon-blue mb-2">${acc.name}</h3>
      <p class="text-sm text-gray-400">${acc.shortDescription}</p>
      <div class="mt-2 text-xs text-gray-500">Price: $${acc.pricePerDay}/day</div>
    `;
    card.addEventListener("click", () => {
      document.getElementById("accommodation").value = acc.id;
      updateTotalPrice();
    });
    container.appendChild(card);
  });
  if (available.length > 0) {
    document.getElementById("accommodation").value = available[0].id;
  }
}

// regex 
const patterns = {
  name: /^[A-Za-zÀ-ÿ\s'-]{2,30}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?\d{7,15}$/
};

function validateField(input) {
  const type = input.dataset.validation;
  const value = input.value.trim();
  const errorDiv = input.nextElementSibling;
  let valid = true;

  if (!value) {
    errorDiv.textContent = "This field is required";
    errorDiv.classList.remove("hidden");
    input.style.borderColor = "rgb(239 68 68)"; // red
    valid = false;
  } else if (patterns[type] && !patterns[type].test(value)) {
    errorDiv.textContent = `Invalid ${type}`;
    errorDiv.classList.remove("hidden");
    input.style.borderColor = "rgb(239 68 68)"; // red
    valid = false;
  } else {
    errorDiv.textContent = "";
    errorDiv.classList.add("hidden");
    input.style.borderColor = "rgb(34 197 94)"; // green
  }

  return valid;
}

function attachValidation(input) {
  input.addEventListener("blur", () => validateField(input));
  input.addEventListener("input", () => validateField(input));
}

// init

document.addEventListener("DOMContentLoaded", async () => {
  createStars();
  await loadAccommodations();
  await loadDestinations();
  updateMaxPassengers();

  document.querySelectorAll("[data-validation]").forEach(attachValidation);
  document.querySelectorAll('input[name="passengers"]').forEach(r => {
    r.addEventListener("change", updateMaxPassengers);
  });
  document.getElementById("add-passenger-btn").addEventListener("click", addPassengerForm);
});

// submit
document.getElementById("booking-form").addEventListener("submit", function (e) {
  e.preventDefault();
  let valid = true;

  document.querySelectorAll("[data-validation]").forEach(input => {
    if (!validateField(input)) valid = false;
  });

  if (!valid) {
    alert(" Please fix the errors in the form.");
    return;
  }

  alert(" Booking confirmed! Your space journey awaits!");
  this.reset();

  // Reset borders after submit
  document.querySelectorAll("[data-validation]").forEach(input => {
    input.style.borderColor = "";
  });
});
