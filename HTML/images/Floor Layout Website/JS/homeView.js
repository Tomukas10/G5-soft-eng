           console.log("homeExample.js has loaded!");

		   document.addEventListener("DOMContentLoaded", async () => 
		   {
				// Fetch the necessary data from the database when the page loads.
				await getTemperatures();
				await getLights();
				
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
			
			// Acquires the temperature from the database.
			async function getTemperatures()
			{
				try
				{
					const response = await fetch('/rooms/temperature');
					const data = await response.json();
					
					data.forEach(room =>
					{
						const tempDisplay = document.getElementById(`${room.roomName.toLowerCase().replace(/\s+/g, '-')}-temp`);
						if (tempDisplay)
						{
							tempDisplay.textContent = room.temperature;
						}
					});
				}
				catch (error)
				{
					console.error("There was an error fetching temperatures.", error);
				}
				
			}

			// Adjusts the temperatures in the database.
			async function changeTemperature(roomName, change)
			{
				const tempDisplay = document.getElementById(`${roomName.toLowerCase().replace(/\s+/g, '-')}-temp`);
				if (!tempDisplay) return;
				
				let newTemperature = parseInt(tempDisplay.textContent) + change;
				
				// Prevents temperatures from eclipsing 30 or going below 10 degrees.
				if (newTemperature < 10 || newTemperature > 30) return;
				
				try
				{
					const response = await fetch(`/rooms/${roomName}/temperature`,
						{
							method: "PUT",
							headers: {"Content-Type": "application/json"},
							body: JSON.stringify({temperature: newTemperature})
						});
						
					if (response.ok)
					{
						// Fetch the latest temperature from the DB and update the UI!
						await getTemperatures();
						
					}
					else
					{
						console.error("Failed to update the temperature.");
					}
						
				}
				catch (error)
				{
					console.error("Error adjusting the temperature:", error);
				}
				
			}
			
			// Acquire light states from the database and display them for both main & kitchen lights.
			async function getLights()
			{
				try
				{
					const response = await fetch('/rooms/lights');
					const data = await response.json();
					
					data.forEach(room =>
					{
						const lightButtonId = `${room.roomName.toLowerCase().replace(/\s+/g, '-')}-mainLight`;
						const lightButton = document.getElementById(lightButtonId);
						if (lightButton)
						{
							lightButton.classList.toggle('green', room.mainLight);
							lightButton.classList.toggle('red', !room.mainLight);
						}
						
					});
				}	
				catch (error)
				{
					console.error("Error fetching light states.", error);
				}
				
			}		
		
			async function toggleLights(roomName)
			{
				const lightButton = document.getElementById(`${roomName.toLowerCase().replace(/\s+/g, '-')}-mainLight`);
				if (!lightButton) return;
				
				const newState = !lightButton.classList.contains('green');
				try
				{
					const response = await fetch(`/rooms/${roomName}/mainLight`,
						{
							method: "PUT",
							headers: {"Content-Type": "application/json"},
							body: JSON.stringify({state: newState})
						});
						
					if (response.ok)
					{
						lightButton.classList.toggle('green', newState);
						lightButton.classList.toggle('red', !newState);
					}
					else
					{
						console.error("Failed to update the light state.");
					}
				}
				catch (error)
				{
					console.error("Error toggling the lights!", error);
				}
			}
		


			


