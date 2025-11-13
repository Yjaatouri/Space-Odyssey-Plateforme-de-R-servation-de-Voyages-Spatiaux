function createStars() {
  const container = document.getElementById("stars-container");
  for (let i = 0; i < 100; i++) {
    const s = document.createElement("div");
    s.className = "star";
    s.style.left = `${Math.random() * 100}%`;
    s.style.top = `${Math.random() * 100}%`;
    s.style.animationDelay = `${Math.random() * 5}s`;
    container.appendChild(s);
  }
}

function loadBookings() {
  try {
    return JSON.parse(localStorage.getItem("passengers") || "[]");
  } catch (e) {
    console.error(e);
    return [];
  }
}

function renderReceipt(bookings) {
  const container = document.getElementById("receipt");
  const noBooking = document.getElementById("no-booking");

  if (!bookings.length) {
    noBooking.classList.remove("hidden");
    return;
  }

  noBooking.classList.add("hidden");
  container.classList.remove("hidden");

  const groups = bookings.reduce((acc, p) => {
    const key = `${p.destination}|${p.departureDate}`;
    if (!acc[key])
      acc[key] = { dest: p.destination, date: p.departureDate, passengers: [] };
    acc[key].passengers.push(p);
    return acc;
  }, {});

  container.innerHTML = Object.values(groups)
    .map((group) => {
      const totalPrice = calculateTotal(group);
      return `
      <div class="receipt-section">
        <h3 class="font-orbitron text-neon-blue text-xl">${group.dest}</h3>
        <p><strong>Departure:</strong> ${new Date(
          group.date
        ).toLocaleDateString()}</p>
        <p><strong>Passengers:</strong> ${group.passengers.length}</p>
        <p class="text-neon-purple font-bold text-lg">Total: $${totalPrice.toLocaleString()}</p>

        <div class="mt-4">
          <strong class="text-neon-cyan">Passenger list:</strong>
          <ul class="list-disc list-inside mt-2 space-y-1 text-sm">
            ${group.passengers
              .map(
                (p) => `
              <li>${p.firstName} ${p.lastName} – ${p.email} – ${p.phone}</li>
            `
              )
              .join("")}
          </ul>
        </div>
      </div>
    `;
    })
    .join("");
}

function calculateTotal(group) {
  const match = group.dest.match(/\$([\d,]+)/);
  const base = match ? parseInt(match[1].replace(/,/g, ""), 10) : 0;

  return base * group.passengers.length;
}

document.addEventListener("DOMContentLoaded", () => {
  createStars();
  const bookings = loadBookings();
  renderReceipt(bookings);
});
