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
						const tempElement = document.getElementById("currentTemp");
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
						const lightImage = document.getElementById(`kitchen-mainLight`);
						if (room.roomName === "Kitchen" && lightImage)
						{
							lightImage.style.filter = room.mainLight ? "brightness(100%)" : "brightness(30%)";
						}
					});
					
					// Acquire kitchen-specific lights from the database.
					const kitchenResponse = await fetch('/rooms/kitchen/lights');
					const kitchenData = await kitchenResponse.json();
					const lightTypes = ["tableLight", "barLight", "counterLight"];
					
					lightTypes.forEach(type =>
					{
						const kitchenImage = document.getElementById(`kitchen-${type}`);
						if (kitchenImage && kitchenData.length > 0 && kitchenData[0].hasOwnProperty(type))
						{
							kitchenImage.style.filter = kitchenData[0][type] ? "brightness(100%)" : "brightness(30%)";
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

