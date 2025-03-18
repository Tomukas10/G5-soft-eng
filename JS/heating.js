           console.log("heating.js has loaded!");

		   document.addEventListener("DOMContentLoaded", async () => 
		   {
				// Fetch the necessary data from the database when the page loads.
				await getTemperatures();
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
			
			async function getTemperatures() {
			    try {
			        const response = await fetch('/rooms/temperature');

			        if (!response.ok) { 
			            throw new Error(`HTTP error! Status: ${response.status}`);
			        }

			        const text = await response.text(); // Read raw response
			        console.log("Raw response from server:", text); // Debugging

			        const data = JSON.parse(text); // Attempt JSON parsing

			        data.forEach(room => {
			            const tempDisplay = document.getElementById(`room-${room.room_id}-temp`);
			            const actualTempDisplay = document.getElementById(`actual-room-${room.room_id}`);

			            if (tempDisplay) tempDisplay.textContent = room.target_temp;
			            if (actualTempDisplay) actualTempDisplay.textContent = room.actual_temp;
			        });

			        getActualTemperature();
			    } catch (error) {
			        console.error("There was an error fetching temperatures.", error);
			    }
			}


			let actualTempInterval = null; // Prevent multiple intervals

			function getActualTemperature() {
			    if (actualTempInterval) return; // If already running, do nothing.

			    actualTempInterval = setInterval(async () => {
			        try {
			            console.log("Running getActualTemperature() cycle..."); // Debugging
			            const response = await fetch('/rooms/temperature');
			            const data = await response.json();

			            console.log("Fetched Data:", data); // Debugging

			            const updatePromises = data.map(async room => {
			                console.log(`Processing ${room.room_id}...`); // Debugging

			                const actualTempDisplay = document.getElementById(`actual-room-${room.room_id}`);
			                if (!actualTempDisplay) {
			                    console.warn(`No actualTempDisplay found for room ${room.room_id}`);
			                    return;
			                }

			                let actualTemp = parseInt(actualTempDisplay.textContent);
			                let targetTemp = room.target_temp;

			                console.log(`Current: ${actualTemp}, Target: ${targetTemp}`); // Debugging

			                if (actualTemp !== targetTemp) {
			                    actualTemp += actualTemp < targetTemp ? 1 : -1;
			                    actualTempDisplay.textContent = actualTemp;

			                    console.log(`Updating DB: Room ${room.room_id} -> ${actualTemp}`); // Debugging

			                    return fetch(`/rooms/${room.room_id}/actualTemp`, {
			                        method: "PUT",
			                        headers: { "Content-Type": "application/json" },
			                        body: JSON.stringify({ actual_temp: actualTemp })
			                    });
			                }
			            });

			            await Promise.all(updatePromises);

			        } catch (error) {
			            console.error("Error adjusting the actual temperature!", error);
			        }
			    }, 3000);
			}

			async function changeTemperature(roomId, change) {
			    const tempDisplay = document.getElementById(`room-${roomId}-temp`);
			    if (!tempDisplay) return;

			    let newTemperature = parseInt(tempDisplay.textContent) + change;

			    // Prevents temperatures from exceeding 30 or dropping below 10.
			    if (newTemperature < 10 || newTemperature > 30) return;

			    console.log(`Updating Room ${roomId}: New target_temp = ${newTemperature}`); // Debugging

			    // **🔹 Immediately update the UI**
			    tempDisplay.textContent = newTemperature;

			    try {
			        const response = await fetch(`/rooms/${roomId}/temperature`, {
			            method: "PUT",
			            headers: { "Content-Type": "application/json" },
			            body: JSON.stringify({ target_temp: newTemperature })
			        });

			        if (response.ok) {
			            console.log(`Temperature for Room ${roomId} updated to ${newTemperature}`);
			        } else {
			            console.error(`Failed to update temperature for Room ${roomId}`);
			        }

			    } catch (error) {
			        console.error("Error adjusting the temperature:", error);
			    }
			}

