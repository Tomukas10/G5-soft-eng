			const token = localStorage.getItem('token');
			
			// Fetches the lights and their respective states from the DB.
			async function getLights() {
				try {
					const lightSection = document.getElementById('lights-section');
					lightSection.innerHTML = ''; // Clear previous lights
			
					const response = await fetch('/rooms/lights/', {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${token}`,  // Send the token in the Authorization header
						}
					});
			
					if (!response.ok) {
						throw new Error(`HTTP error! Status: ${response.status}`);
					}
			
					const lights = await response.json();
					console.log("Fetched Light Data:", lights); // Debugging output.
			
					// Create buttons for each light
					lights.forEach(light => {
						// Create a new button for each light
						const lightButton = document.createElement('button');
						lightButton.id = `light-${light.id}`;
						lightButton.className = `light-btn ${light.state ? 'green' : 'red'}`;
						lightButton.textContent = light.name;
						lightButton.setAttribute('data-id', light.id);
			
						// Add click event listener for toggling
						lightButton.addEventListener('click', async () => {
							await toggleLights(light.id, lightButton);
						});
			
						// Append the button to the light section
						lightSection.appendChild(lightButton);
					});
			
				} catch (error) {
					console.error("Error fetching light states!", error);
				}
			}

		
			// Handles toggling the light on and off with each button press.
			async function toggleLights(lightId, button) {
				try {
					// Determine the new state (toggle the current button class)
					const isLightOn = button.classList.contains('green');
					const newState = isLightOn ? 0 : 1; // Toggle the state
			
					// Send the updated state to the server
					const response = await fetch(`/updateDevice/${lightId}`, {
						method: 'PATCH',
						headers: {
							'Authorization': `Bearer ${token}`,
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ state: newState })
					});
			
					if (!response.ok) {
						throw new Error('Failed to update device state');
					}
			
					// Toggle the button color based on the new state
					button.classList.toggle('green', newState === 1);
					button.classList.toggle('red', newState === 0);
					button.classList.toggle('active', newState === 1);
			
				} catch (error) {
					console.error('Error updating device state:', error);
					alert('Failed to update device. Please try again.');
				}
			}

			// Initially waits for the JS to load before implementing the getLights function, starting it off.
			document.addEventListener("DOMContentLoaded", async () => {
			    await getLights();
			});