const token = localStorage.getItem('token');

let actualTempInterval = null;

// // Acquire temperatures from the database and display them.
function getActualTemperature() {
    if (actualTempInterval) return; // If the function is already running, do nothing for now.

    actualTempInterval = setInterval(async () => {
        try {
            console.log("Running getActualTemperature() cycle..."); // Debugging steps.
            const response = await fetch('/rooms/temperature', {
                method: 'GET',
                headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
            const data = await response.json();

            console.log("Fetched Data:", data); // Debugging steps.

            const updatePromises = data.map(async room => {
                console.log(`Processing room_id: ${room.room_id}`); // Debugging steps.

                
                const actualTempDisplay = document.getElementById(`actual-room-${room.room_id}`);
                if (!actualTempDisplay) {
                    console.warn(`No actualTempDisplay found for room_id ${room.room_id}`);
                    return;
                }

                let actualTemp = parseInt(actualTempDisplay.textContent);
                let targetTemp = room.target_temp;

                console.log(`Current: ${actualTemp}, Target: ${targetTemp}`); // Debugging steps.

                if (actualTemp !== targetTemp) {
                    actualTemp += actualTemp < targetTemp ? 1 : -1;
                    actualTempDisplay.textContent = actualTemp;

                    console.log(`Updating DB: Room ${room.room_id} -> ${actualTemp}`); // Debugging steps.

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

// Acquire light states from the database and display them for main lights.
async function getLights() {
    try {
        const response = await fetch('/rooms/lights');
        const data = await response.json();

        console.log("Light data from server:", data); 

        data.forEach(room => {
            const overlayId = `${room.room_name.toLowerCase().replace(/\s+/g, '-')}-mainLight`;
            console.log(`Processing ${room.room_name}: light state = ${room.state}`);

            const lightOverlay = document.getElementById(overlayId);
            if (lightOverlay) {
                lightOverlay.classList.toggle('on', room.state);
            } else {
                console.warn(`No overlay found for: ${overlayId}`);
            }
        });
    } catch (error) {
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
    }, 3000); // Update every three seconds.
}

// Initiates the auto-updater once the DOM has been loaded.
document.addEventListener("DOMContentLoaded", async () => 
{
    getActualTemperature();
    startAutoUpdate();
});
