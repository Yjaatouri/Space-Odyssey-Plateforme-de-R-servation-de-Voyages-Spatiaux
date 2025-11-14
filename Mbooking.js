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
                    backgroundImage: {
                        'space-pattern': "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgxMzUpIj48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjMWExYTJlIi8+PHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBzdHJva2U9IiMyNjEzZTQiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')",
                    }
                }
            }
        }
        
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



        
        // Create stars background
        function createStars() {
            const container = document.getElementById('stars-container');
            const starCount = 150;
            
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                star.classList.add('star');
                
                // Random size between 1-3px
                const size = Math.random() * 2 + 1;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                
                // Random position
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                
                // Random animation delay
                star.style.animationDelay = `${Math.random() * 5}s`;
                
                container.appendChild(star);
            }
        }
        
        // Mobile menu toggle
        document.getElementById('mobile-menu-button').addEventListener('click', function() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('open');
        });
        
        // Initialize on page load
        document.addEventListener('DOMContentLoaded', function() {
            createStars();
        });

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

// Mbooking.js – Show booking receipt from localStorage
document.addEventListener("DOMContentLoaded", () => {
    const passengers = JSON.parse(localStorage.getItem("passengers") || "[]");
    const receiptDiv = document.getElementById("receipt");
    const noBookingDiv = document.getElementById("no-booking");

    if (passengers.length === 0) {
        noBookingDiv.classList.remove("hidden");
        return;
    }

    noBookingDiv.classList.add("hidden");
    receiptDiv.classList.remove("hidden");

    // Get the latest booking (or all)
    const latestBooking = passengers.slice(-passengers[0]?.passengersCount || 1); // simple way

    let html = `
        <div class="text-center mb-8">
            <h2 class="font-orbitron text-3xl text-neon-blue mb-2">Booking Confirmed!</h2>
            <p class="text-gray-300">Booking Date: ${new Date(passengers[0].bookingDate).toLocaleDateString()}</p>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
            <div class="bg-space-purple/30 p-6 rounded-xl border border-neon-blue/30">
                <h3 class="font-orbitron text-xl text-neon-cyan mb-4">Destination</h3>
                <p class="text-2xl text-neon-blue">${passengers[0].destination}</p>
                <p class="text-gray-300 mt-2">Departure: ${passengers[0].departureDate}</p>
            </div>

            <div class="bg-space-purple/30 p-6 rounded-xl border border-neon-blue/30">
                <h3 class="font-orbitron text-xl text-neon-cyan mb-4">Passengers</h3>
                <p class="text-2xl text-neon-blue">${passengers.length} Traveler(s)</p>
            </div>
        </div>

        <div class="mt-8 bg-space-purple/30 p-6 rounded-xl border border-neon-blue/30">
            <h3 class="font-orbitron text-xl text-neon-cyan mb-4">Passenger Details</h3>
            <div class="space-y-4">
    `;

    passengers.forEach((p, i) => {
        html += `
            <div class="bg-space-dark/70 p-4 rounded-lg">
                <p class="text-neon-blue font-bold">${i === 0 ? "Primary Passenger" : `Passenger ${i + 1}`}</p>
                <p>${p.firstName} ${p.lastName}</p>
                <p class="text-gray-400">${p.email} • ${p.phone}</p>
            </div>
        `;
    });

    html += `
            </div>
        </div>

        <div class="text-center mt-10">
            <a href="index.html" class="btn-primary px-8 py-4 rounded-lg text-lg glow inline-block">
                Back to Home
            </a>
        </div>
    `;

    receiptDiv.innerHTML = html;
});
