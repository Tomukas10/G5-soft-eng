console.log("kitchen.js has loaded!");

			// Acquires the temperature from the database.
			async function getTemperatures()
			{
				try
				{
					const response = await fetch('/rooms/temperature');
					const data = await response.json();
					
					data.forEach(room =>
					{
						if (room.roomName === "Kitchen")
						{
						const tempElement = document.getElementById("kitchen-temp");
						if (tempElement) 
						{
							tempElement.textContent = `${room.temperature}°C`;
						}
						}
					});
				}
				catch (error)
				{
					console.error("There was an error fetching temperatures.", error);
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
						const lightOverlay = document.getElementById(`kitchen-mainLight`);
						if (room.roomName === "Kitchen" && lightOverlay)
						{
							lightOverlay.classList.toggle('on', room.mainLight);
						}
					});
					
					// Acquire kitchen-specific lights from the database.
					const kitchenResponse = await fetch('/rooms/kitchen/lights');
					const kitchenData = await kitchenResponse.json();
					const lightTypes = ["tableLight", "barLight", "counterLight"];
					
					lightTypes.forEach(type =>
					{
						const kitchenOverlay = document.getElementById(`kitchen-${type}`);
						if (kitchenOverlay && kitchenData.length > 0 && kitchenData[0].hasOwnProperty(type))
						{
							kitchenOverlay.classList.toggle('on', kitchenData[0][type]);
						}
					});
				}	
				catch (error)
				{
					console.error("Error fetching light states.", error);
				}
			}	
			
			// Incrementally pings the database for any updates to its contents.
			function startAutoUpdate() 
			{
				setInterval(async () => 
				{
					console.log("Update in progress.");
					await getTemperatures();
					await getLights();
				}, 5000); // Update every five seconds.
			}
			
			
			// Initiates the auto-updater once the DOM has been loaded.
			document.addEventListener("DOMContentLoaded", async () => 
			{
				await getTemperatures();
				await getLights();
				startAutoUpdate();
			});

