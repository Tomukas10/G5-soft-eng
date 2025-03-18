const token = localStorage.getItem('token');
		 
		 document.addEventListener("DOMContentLoaded", async () => 
		   {
				// Fetch the necessary data from the database when the page loads.
				await getTemperatures();
				
				getActualTemperature();
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
			
			// Fetches temperature from the database.
			async function getTemperatures() {
			    try {
			        const response = await fetch('/rooms/temperature', {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${token}`,  // Send the token in the Authorization header
						}
					});

			        if (!response.ok) { 
			            throw new Error(`HTTP error! Status: ${response.status}`);
			        }

			        const data = await response.json();

					const container = document.getElementById('temperature-container');
					container.innerHTML = '';
			        data.forEach(room => {
						container.innerHTML += `								<div class = "temp-column">
									<h3 class = "room-header">${room.room_name}</h3>
										<div class = "temp-control">
											<button class="temp-btn" onclick="changeTemperature(${room.room_id}, 1)">+</button>
											<span class="temp-display" id="room-${room.room_id}-temp">${room.target_temp}</span>
											<button class="temp-btn" onclick="changeTemperature(${room.room_id}, -1)">-</button>
										</div>
										<span class="actual-temp" id="actual-room-${room.room_id}">${room.target_temp}°</span>
								</div>`;
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

			// Prevents multiple intervals from occuring at the same time, ensuring only one cycle runs for temperature updates.
			let actualTempInterval = null; 

			function getActualTemperature() {
			    if (actualTempInterval) return; // If already running, do nothing.

			    actualTempInterval = setInterval(async () => {
			        try {
						const response = await fetch('/rooms/temperature', {
							method: 'GET',
							headers: {
								'Authorization': `Bearer ${token}`,  // Send the token in the Authorization header
							}
						});
			            const data = await response.json();


			            const updatePromises = data.map(async room => {

			                const actualTempDisplay = document.getElementById(`actual-room-${room.room_id}`);
			                if (!actualTempDisplay) {
			                    console.warn(`No actualTempDisplay found for room ${room.room_id}`);
			                    return;
			                }

			                let actualTemp = parseInt(actualTempDisplay.textContent);
			                let targetTemp = room.target_temp;

			               
			                if (actualTemp !== targetTemp) {
			                    actualTemp += actualTemp < targetTemp ? 1 : -1;
			                    actualTempDisplay.textContent = actualTemp;

			               
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
						clearInterval(actualTempInterval);
						actualTempInterval = null;
			        }
			    }, 3000);
			}

			// Changes the temperature accordingly.
			async function changeTemperature(roomId, change) {
			    const tempDisplay = document.getElementById(`room-${roomId}-temp`);
			    if (!tempDisplay) return;

			    let newTemperature = parseInt(tempDisplay.textContent) + change;

			    // Prevents temperatures from exceeding 30 or dropping below 10.
			    if (newTemperature < 10 || newTemperature > 30) return;

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

