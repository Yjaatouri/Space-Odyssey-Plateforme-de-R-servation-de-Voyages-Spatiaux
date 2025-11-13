z   
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

        // login.js - SpaceVoyager Login Page Enhancements

document.addEventListener('DOMContentLoaded', function () {
    console.log('SpaceVoyager Login Page Loaded');

    // Example: Add form submission handler
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            const password = form.querySelector('input[type="password"]').value;

            if (email && password) {
                alert(`Logging in with: ${email}`);
                // Later: Send to backend or redirect
                // window.location.href = 'dashboard.html';
            } else {
                alert('Please fill in all fields.');
            }
        });
    }

    // Optional: Add stars animation if #stars-container exists
    const starsContainer = document.getElementById('stars-container');
    if (starsContainer) {
        for (let i = 0; i < 150; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 5}s`;
            starsContainer.appendChild(star);
        }
    }
});
