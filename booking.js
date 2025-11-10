      tailwind.config = {
        theme: {
          extend: {
            colors: {
              "space-dark": "#0a0a18",
              "space-blue": "#1a1a2e",
              "space-purple": "#16213e",
              "neon-blue": "#0ea5e9",
              "neon-purple": "#8b5cf6",
              "neon-cyan": "#06b6d4",
            },
            fontFamily: {
              orbitron: ["Orbitron", "sans-serif"],
              exo: ["Exo 2", "sans-serif"],
            },
          },
        },
      };

            // Global variables to store data
      let accommodationsData = [];
      let destinationsData = [];
      let passengerCount = 1; // Start with 1 (primary passenger)
      let maxPassengers = 1; // Will be set based on selection

      // Create stars background
      function createStars() {
        const container = document.getElementById("stars-container");
        const starCount = 150;

        for (let i = 0; i < starCount; i++) {
          const star = document.createElement("div");
          star.classList.add("star");

          const size = Math.random() * 2 + 1;
          star.style.width = `${size}px`;
          star.style.height = `${size}px`;

          star.style.left = `${Math.random() * 100}%`;
          star.style.top = `${Math.random() * 100}%`;

          star.style.animationDelay = `${Math.random() * 5}s`;

          container.appendChild(star);
        }
      }

      // Mobile menu toggle
      document
        .getElementById("mobile-menu-button")
        .addEventListener("click", function () {
          const menu = document.getElementById("mobile-menu");
          menu.classList.toggle("open");
        });

      // Accommodation card selection
      function setupAccommodationCardSelection() {
        const accommodationCards = document.querySelectorAll(
          ".accommodation-card"
        );
        const accommodationInput = document.getElementById("accommodation");

        accommodationCards.forEach((card) => {
          card.addEventListener("click", function () {
            accommodationCards.forEach((c) => c.classList.remove("selected"));
            this.classList.add("selected");
            accommodationInput.value = this.dataset.type;
            clearError("accommodation-error");
          });
        });
      }

      // Form validation functions
      function validateName(name) {
        const nameRegex = /^[a-zA-Z\s]{2,50}$/;
        return nameRegex.test(name.trim());
      }

      function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
      }

      function validatePhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ""));
      }

      function validateDate(date) {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      }

      // Show error message
      function showError(input, message) {
        const errorElement = input.parentNode.querySelector(".error-message");
        errorElement.textContent = message;
        errorElement.style.display = "block";
        input.classList.add("input-error");
        input.classList.remove("input-success");
      }

      // Clear error message
      function clearError(errorId) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
          errorElement.textContent = "";
          errorElement.style.display = "none";
        }
      }

      // Show success state
      function showSuccess(input) {
        const errorElement = input.parentNode.querySelector(".error-message");
        errorElement.style.display = "none";
        input.classList.remove("input-error");
        input.classList.add("input-success");
      }

      // Validate input on blur
      function setupInputValidation() {
        const inputs = document.querySelectorAll("input[data-validation]");

        inputs.forEach((input) => {
          input.addEventListener("blur", function () {
            validateInput(this);
          });

          input.addEventListener("input", function () {
            // Clear error as user types
            if (this.value.trim() !== "") {
              const errorElement =
                this.parentNode.querySelector(".error-message");
              errorElement.style.display = "none";
              this.classList.remove("input-error");
            }
          });
        });
      }

      // Validate individual input
      function validateInput(input) {
        const value = input.value.trim();
        const validationType = input.getAttribute("data-validation");

        if (value === "") {
          showError(input, "This field is required");
          return false;
        }

        let isValid = false;
        let errorMessage = "";

        switch (validationType) {
          case "name":
            isValid = validateName(value);
            errorMessage =
              "Please enter a valid name (2-50 characters, letters only)";
            break;
          case "email":
            isValid = validateEmail(value);
            errorMessage = "Please enter a valid email address";
            break;
          case "phone":
            isValid = validatePhone(value);
            errorMessage = "Please enter a valid phone number";
            break;
        }

        if (!isValid) {
          showError(input, errorMessage);
          return false;
        } else {
          showSuccess(input);
          return true;
        }
      }

      // Validate entire form
      function validateForm() {
        let isValid = true;

        // Validate destination
        const destination = document.getElementById("destination");
        if (destination.value === "") {
          showError(destination, "Please select a destination");
          isValid = false;
        } else {
          clearError("destination-error");
        }

        // Validate departure date
        const departureDate = document.getElementById("departure-date");
        if (departureDate.value === "") {
          showError(departureDate, "Please select a departure date");
          isValid = false;
        } else if (!validateDate(departureDate.value)) {
          showError(
            departureDate,
            "Departure date must be today or in the future"
          );
          isValid = false;
        } else {
          clearError("departure-date-error");
        }

        // Validate accommodation
        const accommodation = document.getElementById("accommodation");
        if (accommodation.value === "") {
          showError(accommodation, "Please select an accommodation type");
          isValid = false;
        } else {
          clearError("accommodation-error");
        }

        // Validate passenger forms
        const passengerForms = document.querySelectorAll(".passenger-form");
        passengerForms.forEach((form, index) => {
          const firstName = form.querySelector('input[name="first-name[]"]');
          const lastName = form.querySelector('input[name="last-name[]"]');
          const email = form.querySelector('input[name="email[]"]');
          const phone = form.querySelector('input[name="phone[]"]');

          if (!validateInput(firstName)) isValid = false;
          if (!validateInput(lastName)) isValid = false;
          if (!validateInput(email)) isValid = false;
          if (!validateInput(phone)) isValid = false;
        });

        return isValid;
      }

      // Form submission
      document
        .getElementById("booking-form")
        .addEventListener("submit", function (e) {
          e.preventDefault();

          if (validateForm()) {
            alert(
              "Thank you for your booking! We will contact you shortly to confirm your space journey."
            );
          }
        });

      // Add passenger form
      document
        .getElementById("add-passenger-btn")
        .addEventListener("click", function () {
          if (passengerCount < maxPassengers) {
            addPassengerForm();
          } else {
            alert(
              `Maximum number of passengers for ${getPassengerType()} is ${maxPassengers}`
            );
          }
        });

      // Get passenger type based on selection
      function getPassengerType() {
        const selected = document.querySelector(
          'input[name="passengers"]:checked'
        );
        return selected ? selected.value : "solo";
      }

      // Update max passengers based on selection
      function updateMaxPassengers() {
        const passengerType = getPassengerType();

        switch (passengerType) {
          case "solo":
            maxPassengers = 1;
            break;
          case "couple":
            maxPassengers = 2;
            break;
          case "group":
            maxPassengers = 6;
            break;
        }

        // Update button text
        const addButton = document.getElementById("add-passenger-btn");
        if (passengerType === "solo") {
          addButton.style.display = "none";
        } else {
          addButton.style.display = "block";
          addButton.textContent = `Add Passenger`;
        }

        // Remove extra forms if needed
        const passengerForms = document.querySelectorAll(".passenger-form");
        if (passengerForms.length > maxPassengers) {
          for (let i = passengerForms.length - 1; i >= maxPassengers; i--) {
            passengerForms[i].remove();
          }
          passengerCount = maxPassengers;
        }
      }

      // Add passenger form
      function addPassengerForm() {
        if (passengerCount < maxPassengers) {
          passengerCount++;

          const container = document.getElementById(
            "passenger-forms-container"
          );
          const newForm = document.createElement("div");
          newForm.className = "passenger-form";
          newForm.id = `passenger-form-${passengerCount}`;

          newForm.innerHTML = `
            <div class="passenger-header">
              <h3 class="font-orbitron text-neon-blue">Passenger ${passengerCount}</h3>
              <div class="remove-passenger" data-index="${passengerCount}">
                <i class="fas fa-times"></i>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <!-- First Name -->
              <div>
                <label class="block mb-2 text-gray-300">First Name</label>
                <input
                  type="text"
                  name="first-name[]"
                  placeholder="Enter passenger first name"
                  required
                  data-validation="name"
                />
                <div class="error-message" data-error="first-name"></div>
              </div>

              <!-- Last Name -->
              <div>
                <label class="block mb-2 text-gray-300">Last Name</label>
                <input
                  type="text"
                  name="last-name[]"
                  placeholder="Enter passenger last name"
                  required
                  data-validation="name"
                />
                <div class="error-message" data-error="last-name"></div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <!-- Email -->
              <div>
                <label class="block mb-2 text-gray-300">Email Address</label>
                <input
                  type="email"
                  name="email[]"
                  placeholder="Enter passenger email"
                  required
                  data-validation="email"
                />
                <div class="error-message" data-error="email"></div>
              </div>

              <!-- Phone -->
              <div>
                <label class="block mb-2 text-gray-300">Phone Number</label>
                <input
                  type="tel"
                  name="phone[]"
                  placeholder="Enter passenger phone number"
                  required
                  data-validation="phone"
                />
                <div class="error-message" data-error="phone"></div>
              </div>
            </div>

            <!-- Special Requirements -->
            <div class="mb-6">
              <label class="block mb-2 text-gray-300"
                >Special Requirements</label
              >
              <textarea
                class="pl-3 pt-1"
                name="special-requirements[]"
                rows="4"
                placeholder="Any special requirements or notes..."
              ></textarea>
            </div>
          `;

          container.appendChild(newForm);

          // Update button text
          document.getElementById(
            "add-passenger-btn"
          ).textContent = `Add Passenger`;

          // Setup validation for new inputs
          setupInputValidation();

          // Add event listener for remove button
          const removeButton = newForm.querySelector(".remove-passenger");
          removeButton.addEventListener("click", function () {
            const index = parseInt(this.getAttribute("data-index"));
            removePassengerForm(index);
          });
        }
      }

      // Remove passenger form
      function removePassengerForm(index) {
        const formToRemove = document.getElementById(`passenger-form-${index}`);
        if (formToRemove) {
          formToRemove.remove();
          passengerCount--;

          // Update button text
          document.getElementById(
            "add-passenger-btn"
          ).textContent = `Add Passenger (${passengerCount}/${maxPassengers})`;

          // Renumber remaining forms
          const passengerForms = document.querySelectorAll(".passenger-form");
          passengerForms.forEach((form, i) => {
            if (i > 0) {
              // Skip primary passenger
              form.id = `passenger-form-${i + 1}`;
              const header = form.querySelector(".passenger-header h3");
              header.textContent = `Passenger ${i + 1}`;

              const removeButton = form.querySelector(".remove-passenger");
              removeButton.setAttribute("data-index", i + 1);
            }
          });
        }
      }

      // Load accommodations from JSON
      async function loadAccommodations() {
        try {
          const response = await fetch("accommodations.json");

          if (!response.ok) {
            throw new Error(
              `Failed to load accommodations: ${response.status}`
            );
          }

          const data = await response.json();
          accommodationsData = data.accommodations;

          console.log("Accommodations loaded:", accommodationsData);
        } catch (error) {
          console.error("Error loading accommodations:", error);
          alert("Unable to load accommodations. Please try again later.");
        }
      }

      // Load destinations from JSON
      async function loadDestinations() {
        try {
          const response = await fetch("destinations.json");

          if (!response.ok) {
            throw new Error(`Failed to load destinations: ${response.status}`);
          }

          const data = await response.json();
          destinationsData = data.destinations;

          const destinationSelect = document.getElementById("destination");

          // Clear existing options except the first one
          while (destinationSelect.children.length > 1) {
            destinationSelect.removeChild(destinationSelect.lastChild);
          }

          // Add destinations from JSON
          destinationsData.forEach((dest) => {
            const option = document.createElement("option");
            option.value = dest.id;
            option.textContent = `${dest.name} - ${
              dest.travelDuration
            } - From $${dest.price.toLocaleString()}`;
            option.setAttribute("data-destination", JSON.stringify(dest));
            destinationSelect.appendChild(option);
          });

          // Add event listener to show destination info when selected
          destinationSelect.addEventListener("change", function () {
            const selectedOption = this.options[this.selectedIndex];
            const destinationInfo = document.getElementById("destination-info");
            const accommodationsSection = document.getElementById(
              "accommodations-section"
            );

            if (selectedOption.value) {
              const dest = JSON.parse(
                selectedOption.getAttribute("data-destination")
              );

              // Update destination info display
              document.getElementById("destination-name").textContent =
                dest.name;
              document.getElementById("destination-description").textContent =
                dest.description;
              document.getElementById("destination-duration").textContent =
                dest.travelDuration;
              document.getElementById("destination-distance").textContent =
                dest.distance;
              document.getElementById("destination-gravity").textContent =
                dest.gravity;
              document.getElementById("destination-temperature").textContent =
                dest.temperature;
              document.getElementById(
                "destination-price"
              ).textContent = `$${dest.price.toLocaleString()} ${
                dest.currency
              }`;

              // Show the destination info
              destinationInfo.classList.remove("hidden");

              // Show and populate accommodations for this destination
              showAccommodationsForDestination(dest);
              accommodationsSection.classList.add("visible");
            } else {
              // Hide the destination info and accommodations
              destinationInfo.classList.add("hidden");
              accommodationsSection.classList.remove("visible");
            }
          });
        } catch (error) {
          console.error("Error loading destinations:", error);

          // Fallback: You can add some default options here if the fetch fails
          const destinationSelect = document.getElementById("destination");
          const fallbackOption = document.createElement("option");
          fallbackOption.value = "";
          fallbackOption.textContent = "Unable to load destinations";
          fallbackOption.disabled = true;
          destinationSelect.appendChild(fallbackOption);

          // Show error message to user
          alert("Unable to load destinations. Please try again later.");
        }
      }

      // Show accommodations for selected destination
      function showAccommodationsForDestination(destination) {
        const accommodationsContainer = document.getElementById(
          "accommodations-container"
        );
        const accommodationInput = document.getElementById("accommodation");

        // Clear existing accommodation cards
        accommodationsContainer.innerHTML = "";

        // Get available accommodation IDs for this destination
        const availableAccommodationIds = destination.accommodations || [];

        // Filter accommodations to show only those available at this destination
        const availableAccommodations = accommodationsData.filter((acc) =>
          availableAccommodationIds.includes(acc.id)
        );

        // Create accommodation cards
        availableAccommodations.forEach((acc, index) => {
          const card = document.createElement("div");
          card.className = `accommodation-card ${
            index === 0 ? "selected" : ""
          }`;
          card.dataset.type = acc.id;

          card.innerHTML = `
            <h3 class="font-orbitron text-neon-blue mb-2">${acc.name}</h3>
            <p class="text-sm text-gray-400">${acc.shortDescription}</p>
            <div class="mt-3 text-xs text-gray-500">
              <div class="flex justify-between mb-1">
                <span>Size:</span>
                <span>${acc.size}</span>
              </div>
              <div class="flex justify-between mb-1">
                <span>Occupancy:</span>
                <span>${acc.occupancy}</span>
              </div>
              <div class="flex justify-between">
                <span>Price:</span>
                <span class="font-bold text-neon-cyan">$${acc.pricePerDay}/day</span>
              </div>
            </div>
          `;

          accommodationsContainer.appendChild(card);
        });

        // Set the first accommodation as selected by default
        if (availableAccommodations.length > 0) {
          accommodationInput.value = availableAccommodations[0].id;
        }

        // Set up event listeners for the new accommodation cards
        setupAccommodationCardSelection();
      }

      // Initialize on page load
      document.addEventListener("DOMContentLoaded", async function () {
        createStars();

        // Setup passenger selection change
        const passengerRadios = document.querySelectorAll(
          'input[name="passengers"]'
        );
        passengerRadios.forEach((radio) => {
          radio.addEventListener("change", function () {
            updateMaxPassengers();
          });
        });

        // Initialize max passengers
        updateMaxPassengers();

        // Setup input validation
        setupInputValidation();

        // Load both accommodations and destinations
        await loadAccommodations();
        await loadDestinations();
      });