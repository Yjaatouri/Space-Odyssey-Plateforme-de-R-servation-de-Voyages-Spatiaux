/* -------------------------------------------------
   My Booking – read localStorage & render receipt
   ------------------------------------------------- */

function createStars() {
  const container = document.getElementById("stars-container");
  for (let i = 0; i < 100; i++) {
    const s = document.createElement("div");
    s.className = "star";
    s.style.left = `${Math.random() * 100}%`;
    s.style.top  = `${Math.random() * 100}%`;
    s.style.animationDelay = `${Math.random() * 5}s`;
    container.appendChild(s);
  }
}

/* ---------- Load data ---------- */
function loadBookings() {
  try {
    return JSON.parse(localStorage.getItem("passengers") || "[]");
  } catch (e) {
    console.error(e);
    return [];
  }
}

/* ---------- Render receipt ---------- */
function renderReceipt(bookings) {
  const container = document.getElementById("receipt");
  const noBooking = document.getElementById("no-booking");

  if (!bookings.length) {
    noBooking.classList.remove("hidden");
    return;
  }

  noBooking.classList.add("hidden");
  container.classList.remove("hidden");

  // Group by booking (same destination + date = one booking)
  const groups = bookings.reduce((acc, p) => {
    const key = `${p.destination}|${p.departureDate}`;
    if (!acc[key]) acc[key] = { dest: p.destination, date: p.departureDate, passengers: [] };
    acc[key].passengers.push(p);
    return acc;
  }, {});

  container.innerHTML = Object.values(groups).map(group => {
    const totalPrice = calculateTotal(group);
    return `
      <div class="receipt-section">
        <h3 class="font-orbitron text-neon-blue text-xl">${group.dest}</h3>
        <p><strong>Departure:</strong> ${new Date(group.date).toLocaleDateString()}</p>
        <p><strong>Passengers:</strong> ${group.passengers.length}</p>
        <p class="text-neon-purple font-bold text-lg">Total: $${totalPrice.toLocaleString()}</p>

        <div class="mt-4">
          <strong class="text-neon-cyan">Passenger list:</strong>
          <ul class="list-disc list-inside mt-2 space-y-1 text-sm">
            ${group.passengers.map(p => `
              <li>${p.firstName} ${p.lastName} – ${p.email} – ${p.phone}</li>
            `).join("")}
          </ul>
        </div>
      </div>
    `;
  }).join("");
}

/* ---------- Very small price logic (same as booking page) ---------- */
function calculateTotal(group) {
  // We stored only the destination name + price inside the option text.
  // Example: "Mars – $250000"
  const match = group.dest.match(/\$([\d,]+)/);
  const base = match ? parseInt(match[1].replace(/,/g, ""), 10) : 0;

  // In a real app you would also store the accommodation price.
  // For demo we just use the base price * passengers.
  return base * group.passengers.length;
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  createStars();
  const bookings = loadBookings();
  renderReceipt(bookings);
});