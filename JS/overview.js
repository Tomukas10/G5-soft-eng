const token = localStorage.getItem('token');

let actualTempInterval = null;

// // Acquire temperatures from the database and display them.
function getActualTemperature() {
    if (actualTempInterval) return; // If the function is already running, do nothing for now.

    actualTempInterval = setInterval(async () => {
        try {
            const response = await fetch('/rooms/temperature', {
                method: 'GET',
                headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
            const data = await response.json();


            const updatePromises = data.map(async room => {

                
                const actualTempDisplay = document.getElementById(`actual-room-${room.room_id}`);
                if (!actualTempDisplay) {
                    console.warn(`No actualTempDisplay found for room_id ${room.room_id}`);
                    return;
                }

                actualTempDisplay.textContent = room.actual_temp + `°C`;
                let actualTemp = parseInt(actualTempDisplay.textContent);
                let targetTemp = room.target_temp;
                console.log(room.actual_temp);

                if (actualTemp !== targetTemp) {
                    actualTemp += actualTemp < targetTemp ? 1 : -1;
                    actualTempDisplay.textContent = actualTemp + `°C`;


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
        const response = await fetch('/rooms/lights/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Send the token in the Authorization header
            }
        });

        const data = await response.json();


        data.forEach(light => {
            const overlayId = light.name.replace(/ /g, '-');            ;

            const lightOverlay = document.getElementById(overlayId);
            if (lightOverlay) {
                lightOverlay.classList.toggle('on', light.state);
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
        await getLights();
    }, 30); // Update every three seconds.
}

// Initiates the auto-updater once the DOM has been loaded.
document.addEventListener("DOMContentLoaded", async () => 
{
    getActualTemperature();
    startAutoUpdate();
});
