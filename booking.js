let accommodationsData = [];
let destinationsData = [];
let passengerCount = 1;
let maxPassengers = 1;

// Crée un fond étoilé (inchangé)
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

// 🧮 Met à jour le prix total
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

// 🧍 Ajoute un passager
function addPassengerForm() {
  if (passengerCount >= maxPassengers) return;
  passengerCount++;
  const container = document.getElementById("passenger-forms-container");
  const newDiv = document.createElement("div");
  newDiv.className = "passenger-form";
  newDiv.innerHTML = `
    <h3 class="font-orbitron text-neon-blue">Passenger ${passengerCount}</h3>
    <input type="text" placeholder="First Name" required data-validation="name" />
    <input type="text" placeholder="Last Name" required data-validation="name" />
    <input type="email" placeholder="Email" required data-validation="email" />
    <input type="tel" placeholder="Phone" required data-validation="phone" />
  `;
  container.appendChild(newDiv);
  updateTotalPrice();
}

// 🔁 Met à jour le nombre max de passagers
function updateMaxPassengers() {
  const type = document.querySelector('input[name="passengers"]:checked').value;
  if (type === "solo") maxPassengers = 1;
  if (type === "couple") maxPassengers = 2;
  if (type === "group") maxPassengers = 6;

  // Supprime les passagers en trop
  const forms = document.querySelectorAll(".passenger-form");
  if (forms.length > maxPassengers) {
    for (let i = forms.length - 1; i >= maxPassengers; i--) {
      forms[i].remove();
    }
    passengerCount = maxPassengers;
  }

  updateTotalPrice();
}

// 🏨 Charge les hébergements
async function loadAccommodations() {
  const res = await fetch("accommodations.json");
  const data = await res.json();
  accommodationsData = data.accommodations;
}

// 🌍 Charge les destinations
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

// 🏨 Affiche les hébergements disponibles
function showAccommodationsForDestination(dest) {
  const container = document.getElementById("accommodations-container");
  container.innerHTML = "";
  const available = accommodationsData.filter(a => dest.accommodations.includes(a.id));
  available.forEach(acc => {
    const card = document.createElement("div");
    card.className = "accommodation-card";
    card.dataset.type = acc.id;
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

// 🚀 Initialisation
document.addEventListener("DOMContentLoaded", async () => {
  createStars();
  await loadAccommodations();
  await loadDestinations();

  updateMaxPassengers();

  document.querySelectorAll('input[name="passengers"]').forEach(r => {
    r.addEventListener("change", updateMaxPassengers);
  });

  document.getElementById("add-passenger-btn").addEventListener("click", addPassengerForm);
});

/* -------------------------------------------------
   1. Show / hide Suit Size based on destination
   ------------------------------------------------- */
function toggleSuitSize(dest) {
  const suitSection = document.getElementById("suit-size-section");
  const suitSelect   = document.getElementById("suit-size");

  // Reset previous selection
  suitSelect.value = "";
  document.getElementById("suit-size-error").textContent = "";

  if (dest.activities && dest.activities.includes("moonwalk")) {
    suitSection.classList.remove("hidden");
    suitSelect.setAttribute("required", "required");
  } else {
    suitSection.classList.add("hidden");
    suitSelect.removeAttribute("required");
  }
}

/* -------------------------------------------------
   2. Hook into destination change
   ------------------------------------------------- */
document.getElementById("destination").addEventListener("change", function () {
  const selected = this.options[this.selectedIndex];
  const dest = JSON.parse(selected.getAttribute("data-destination"));

  // … existing code you already have …
  toggleSuitSize(dest);               // <-- NEW
});

/* -------------------------------------------------
   3. Form validation (add to your submit handler)
   ------------------------------------------------- */
document.getElementById("booking-form").addEventListener("submit", function (e) {
  let valid = true;

  // ---- Suit Size validation (only when visible) ----
  const suitSection = document.getElementById("suit-size-section");
  const suitSelect  = document.getElementById("suit-size");
  const suitError   = document.getElementById("suit-size-error");

  if (!suitSection.classList.contains("hidden") && !suitSelect.value) {
    suitError.textContent = "Please select a suit size.";
    valid = false;
  } else {
    suitError.textContent = "";
  }

  // … your existing validation logic …

  if (!valid) e.preventDefault();
});