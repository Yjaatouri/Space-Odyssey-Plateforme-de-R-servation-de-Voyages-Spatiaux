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

 document.addEventListener("DOMContentLoaded", function() {
  createStars();

  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const navLogin = document.getElementById("nav-login");

  if (loggedUser && navLogin) {
    navLogin.remove();
  }

  if (loggedUser) {
    const header = document.createElement("div");
    header.className = "text-center mt-6 flex flex-col items-center"; // flex for better control

    // 🔘 Logout button (first)
    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "Logout";
    logoutBtn.className =
      "bg-gradient-to-r from-neon-blue to-neon-purple text-white px-6 py-2 rounded-lg font-bold glow hover:opacity-90 transition";

    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedUser");
      alert("You have been logged out!");
      window.location.href = "login.html";
    });

    // 🔘 Welcome message (second)
    const welcome = document.createElement("p");
    welcome.className = "text-neon-blue font-orbitron text-xl mt-4"; // use mt-4 for spacing below button
    welcome.textContent = `Welcome back, ${loggedUser.email}!`;

    // ✅ Append in the desired order
    header.appendChild(logoutBtn);
    header.appendChild(welcome);

    document.body.prepend(header);
  }
});
