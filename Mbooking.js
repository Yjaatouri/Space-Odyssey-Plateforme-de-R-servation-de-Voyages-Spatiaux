// Mbooking.js – FINAL 100% WORKING VERSION
// Shows correct price + fixes email overflow

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
      }
    }
  }
};

// Create stars
function createStars() {
  const container = document.getElementById("stars-container");
  if (!container) return;
  for (let i = 0; i < 160; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDelay = Math.random() * 6 + "s";
    star.style.width = star.style.height = Math.random() * 2.5 + 0.5 + "px";
    container.appendChild(star);
  }
}

// Load bookings from localStorage (correct key!)
function getBookings() {
  try {
    const data = localStorage.getItem("bookings");
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error loading bookings:", e);
    return [];
  }
}

// MAIN FUNCTION – Renders the receipt
function renderReceipt() {
  const bookings = getBookings();
  const receipt = document.getElementById("receipt");
  const noBooking = document.getElementById("no-booking");

  if (!bookings || bookings.length === 0) {
    noBooking.classList.remove("hidden");
    receipt.classList.add("hidden");
    return;
  }

  const latest = bookings[bookings.length - 1]; // Latest booking

  noBooking.classList.add("hidden");
  receipt.classList.remove("hidden");

  receipt.innerHTML = `
    <div class="text-center mb-12">
      <h2 class="font-orbitron text-5xl md:text-6xl text-glow text-neon-blue mb-4">
        Booking Confirmed!
      </h2>
      <p class="text-lg text-gray-300">
        Booked on ${new Date(latest.bookingDate).toLocaleDateString()} at ${new Date(latest.bookingDate).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
      </p>
    </div>

    <!-- Destination + Total -->
    <div class="grid md:grid-cols-2 gap-8 mb-10">
      <div class="bg-gradient-to-br from-space-purple/50 to-space-blue/40 p-8 rounded-2xl border border-neon-blue/50 backdrop-blur-sm">
        <h3 class="font-orbitron text-2xl text-neon-cyan mb-4">Destination</h3>
        <p class="text-4xl font-bold text-neon-blue">${latest.destination}</p>
        <p class="text-lg text-gray-300 mt-4">
          Departure: <span class="text-neon-purple font-bold">${new Date(latest.departureDate).toLocaleDateString()}</span>
        </p>
        ${latest.accommodation ? `<p class="text-gray-400 mt-2">Accommodation: <span class="text-neon-cyan">${latest.accommodation}</span></p>` : ''}
      </div>

      <div class="bg-gradient-to-br from-neon-purple/40 to-neon-cyan/40 p-8 rounded-2xl border border-neon-purple/50 text-center backdrop-blur-sm">
        <h3 class="font-orbitron text-2xl text-neon-cyan mb-6">Total Price</h3>
        <p class="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">
          $${(latest.total || 0).toLocaleString()}
        </p>
        <p class="text-xl text-gray-300 mt-4">${latest.totalPassengers} Traveler${latest.totalPassengers > 1 ? 's' : ''}</p>
      </div>
    </div>

    <!-- Passenger Cards – EMAIL NOW STAYS INSIDE -->
    <div class="bg-space-dark/70 p-8 rounded-2xl border border-neon-blue/30">
      <h3 class="font-orbitron text-3xl text-neon-cyan text-center mb-8">Passenger Details</h3>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        ${latest.passengers.map((p, i) => `
          <div class="bg-space-purple/40 backdrop-blur-sm p-6 rounded-xl border border-neon-blue/30 overflow-hidden">
            <p class="text-neon-blue font-bold text-lg mb-2">
              ${i === 0 ? "Primary Passenger" : `Passenger ${i + 1}`}
            </p>
            <p class="text-2xl text-white">${p.firstName} ${p.lastName}</p>
            <div class="mt-3 space-y-1 text-gray-300 text-sm">
              <p class="truncate">${p.email}</p>
              <p>${p.phone}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="text-center mt-12">
      <a href="index.html" class="btn-primary px-10 py-4 rounded-lg text-xl font-bold glow inline-block">
        Back to Home
      </a>
    </div>
  `;
}

// Mobile menu
document.getElementById("mobile-menu-button")?.addEventListener("click", () => {
  document.getElementById("mobile-menu").classList.toggle("hidden");
});

// Run everything
document.addEventListener("DOMContentLoaded", () => {
  createStars();
  renderReceipt();

  // Remove login link if user is logged in
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  const navLogin = document.getElementById("nav-login");
  if (user && navLogin) navLogin.remove();
});