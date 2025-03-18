           console.log("heating.js has loaded!");

		   document.addEventListener("DOMContentLoaded", async () => 
		   {
				// Fetch the necessary data from the database when the page loads.
				await getLights();
				
				getActualTemperature();
				// Checks to make sure the relevant buttons exist before adding event listeners.
				const kitchenTempButton = document.getElementById("kitchenTemperature");
				if (kitchenTempButton) kitchenTempButton.addEventListener("click", () => showSection("temperature"));

				const kitchenLightsButton = document.getElementById("kitchenLights");
				if (kitchenLightsButton) kitchenLightsButton.addEventListener("click", () => showSection("lights"));

				const kitchenOvenButton = document.getElementById("kitchenOven");
				if (kitchenOvenButton) kitchenOvenButton.addEventListener("click", () => showSection("oven"));

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
				

				document.getElementById("kitchenTemperature").addEventListener("click", () => showSection("temperature"));
				document.getElementById("kitchenLights").addEventListener("click", () => showSection("lights"));
				document.getElementById("kitchenOven").addEventListener("click", () => showSection("oven"));
			});

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
			
			// Acquire light states from the database and update UI
			async function getLights() {
			    try {
			        const response = await fetch('/rooms/lights');
			        if (!response.ok) {
			            throw new Error(`HTTP error! Status: ${response.status}`);
			        }

			        const lights = await response.json();
			        console.log("Fetched Light Data:", lights); // Debugging process

			        lights.forEach(room => {
			            const lightButtonId = `${room.room_name.toLowerCase().replace(/\s+/g, '-')}-mainLight`;
			            const lightButton = document.getElementById(lightButtonId);

			            if (!lightButton) {
			                console.warn(`No lightButton found for room: ${room.room_name} (ID: ${room.room_id})`);
			                return;
			            }

			            // Update button colors
			            lightButton.classList.toggle('green', room.state);
			            lightButton.classList.toggle('red', !room.state);
			        });
			    } catch (error) {
			        console.error("Error fetching light states!", error);
			    }
			}

		
			// Handles toggling the light on and off with each button press.
			async function toggleLights(roomId, roomName) {
			    const lightButtonId = `${roomName.toLowerCase().replace(/\s+/g, '-')}-mainLight`;
			    const lightButton = document.getElementById(lightButtonId);

			    if (!lightButton) {
			        console.warn(`No button found for room: ${roomName} (ID: ${roomId})`);
			        return;
			    }

			    // Toggle new state
			    const newState = !lightButton.classList.contains('green');

			    try {
			        const response = await fetch(`/rooms/${roomId}/light`, {
			            method: "PUT",
			            headers: { "Content-Type": "application/json" },
			            body: JSON.stringify({ state: newState })
			        });

			        if (response.ok) {
			            console.log(`Light for Room ${roomId} updated to ${newState}`); // Debugging
			            lightButton.classList.toggle('green', newState);
			            lightButton.classList.toggle('red', !newState);
			        } else {
			            console.error("Failed to update the light state.");
			        }
			    } catch (error) {
			        console.error("Error toggling the lights!", error);
			    }
			}

			// Initially waits for the JS to load before implementing the getLights function, starting it off.
			document.addEventListener("DOMContentLoaded", async () => {
			    await getLights();
			});