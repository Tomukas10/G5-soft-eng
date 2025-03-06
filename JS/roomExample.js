           console.log("homeExample.js has loaded!");

		   document.addEventListener("DOMContentLoaded", () => 
		   {

                // Add Room Button Click Event
                const addRoomButton = document.getElementById("addRoomButton");
                const addRoomModal = document.getElementById("addRoomModal");
                const createRoomButton = document.getElementById("createRoomButton");
                const cancelRoomButton = document.getElementById("cancelRoomButton");
                const roomNameInput = document.getElementById("roomName");

                addRoomButton.addEventListener("click", () => {
                    addRoomModal.style.display = "block"; // Show the modal
                });

                cancelRoomButton.addEventListener("click", () => {
                    addRoomModal.style.display = "none"; // Hide the modal
                    roomNameInput.value = ""; // Clear input
                });

                createRoomButton.addEventListener("click", () => {
                    const roomName = roomNameInput.value.trim();
                    if (roomName) {
                        // Create a new room element
                        const newRoom = document.createElement("div");
                        newRoom.innerHTML = `
                            <img class="icon" src="../images/bedroom.png">
                            <h4>${roomName}</h4>
                        `;
                        document.getElementById("boxes").insertBefore(newRoom, addRoomButton);
                        addRoomModal.style.display = "none"; // Hide the modal
                        roomNameInput.value = ""; // Clear input
                    } else {
                        alert("Please enter a room name.");
                    }
                });
				
				// Clicking a lights button switches the active colour from green to red and vice-versa.
				document.querySelectorAll(".light-btn").forEach((btn) => 
				{
					btn.addEventListener("click", () => 
					{
						btn.classList.toggle("green");
						btn.classList.toggle("red");
					});
				});

				document.getElementById("kitchenTemperature").addEventListener("click", () => showSection("temperature"));
				document.getElementById("kitchenLights").addEventListener("click", () => showSection("lights"));
				document.getElementById("kitchenOven").addEventListener("click", () => showSection("oven"));
			});

            function updateSpeedometer(percentage) 
			{
				let value = Math.max(0, Math.min(100, percentage)); 
				let dashOffset = 125 - (value / 100) * 125; 
				let rotation = -90 + (value / 100) * 180; 

				document.getElementById("gauge").style.strokeDashoffset = dashOffset;
				document.getElementById("needle").setAttribute("transform", `rotate(${rotation}, 50, 50)`);
				document.getElementById("percentage").textContent = `${value}%`;
			}

			// Handles the 'invisible' property of each section.
			function showSection(section) 
			{
			// Hide all the sections until they're clicked by default.
				document.querySelectorAll(".dynamic-section").forEach(div => 
				{
					div.classList.add("hidden");
				});

			// Show the section that has been clicked.
				const targetSection = document.getElementById(section + "-section");
				if (targetSection) 
				{
					targetSection.classList.remove("hidden");
				}

			// Resets all the buttons to an inactive state.
				document.querySelectorAll(".appliance").forEach(button => 
				{
					button.classList.remove("active");
				});

				// If a button is clicked, it becomes active.
				const activeButton = document.getElementById(`kitchen${section.charAt(0).toUpperCase() + section.slice(1)}`);
				if (activeButton) 
				{
					activeButton.classList.add("active");
				}
			}
			
			function adjustTemperature(room, change) 
			{
				const tempDisplay = document.getElementById(`${room}-temp`);
				let currentTemp = parseInt(tempDisplay.textContent, 10);

				// Ensures temperature limits so users cannot torch their house or freeze it.
				if ((currentTemp + change) >= 10 && (currentTemp + change) <= 30) 
				{
					tempDisplay.textContent = currentTemp + change;
				}
			}

			


