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
        }

                // Create stars background
        function createStars() {
            const container = document.getElementById('stars-container');
            const starCount = 150;
            
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                star.classList.add('star');
                
                const size = Math.random() * 2 + 1;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                
                star.style.animationDelay = `${Math.random() * 5}s`;
                
                container.appendChild(star);
            }
        }
        
        document.addEventListener('DOMContentLoaded', function() {
            createStars();
        });

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
