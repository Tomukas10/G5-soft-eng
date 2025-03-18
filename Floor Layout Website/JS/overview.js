console.log("overview.js has loaded!");

// Accurately maps the room IDs to the corresponding HTML/CSS elements!

const roomIdToMap = {
	37: "kitchen",
	38: "living-room",
	39: "bedroom-1",
	40: "bedroom-2"
}

// Connects the 'roomID' to the CSS/HTML names.
function mappingIdToNames(roomId)
{
	return roomIdToMap[roomId] || `room-${roomId}`;
}

let actualTempInterval = null;

// // Acquire temperatures from the database and display them.
function getActualTemperature() {
    if (actualTempInterval) return; // If already running, do nothing.

    actualTempInterval = setInterval(async () => {
        try {
            console.log("Running getActualTemperature() cycle..."); // Debugging
            const response = await fetch('/rooms/temperature');
            const data = await response.json();

            console.log("Fetched Data:", data); // Debugging

            const updatePromises = data.map(async room => {
                console.log(`Processing ${room.roomName}...`); // Debugging

				// Allows the formatting of the CSS/HTML temperature elements to remain the same.
				const roomName = mappingIdToNames(room.room_id);
				const formattedName = roomName.toLowerCase().replace(/\s+/g, '-');
				const actualTempDisplay = document.getElementById(`actual-${formattedName}`);

                if (!actualTempDisplay) {
                    console.warn(`No actualTempDisplay found for ${room.roomName}`);
                    return;
                }

                let actualTemp = parseInt(actualTempDisplay.textContent);
                let targetTemp = room.temperature;

                console.log(`Current: ${actualTemp}, Target: ${targetTemp}`); // Debugging

                if (actualTemp !== targetTemp) {
                    actualTemp += actualTemp < targetTemp ? 1 : -1;
                    actualTempDisplay.textContent = actualTemp;

                    console.log(`Updating DB: ${room.roomName} -> ${actualTemp}`); // Debugging

                    return fetch(`/rooms/${room.roomName}/actualTemp`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ actualTemp })
                    });
                }
            });

            await Promise.all(updatePromises);

        } catch (error) {
            console.error("Error adjusting the actual temperature!", error);
        }
    }, 3000);
}

// Acquire light states from the database and display them for main lights.
async function getLights() 
{
    try 
	{
        const response = await fetch('/rooms/lights');
        const data = await response.json();

        console.log("Light data from server:", data); // Log server response

        data.forEach(room => 
		{
            const lightOverlay = document.getElementById(`${room.roomName.toLowerCase().replace(/\s+/g, '-')}-mainLight`);
            console.log(`Processing ${room.roomName}: light state = ${room.mainLight}`);

            if (lightOverlay) 
			{
                lightOverlay.classList.toggle('on', room.mainLight);
            }
        });
    } catch (error) 
	{
        console.error("Error fetching light states.", error);
    }
}


// Incrementally pings the database for any updates to its contents.
function startAutoUpdate() 
{
    setInterval(async () => 
	{
        console.log("Updating home view.");
        await getLights();
    }, 3000); // Update every five seconds.
}

// Initiates the auto-updater once the DOM has been loaded.
document.addEventListener("DOMContentLoaded", async () => 
{
    getActualTemperature();
    startAutoUpdate();
});