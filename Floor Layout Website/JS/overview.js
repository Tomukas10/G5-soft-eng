console.log("overview.js has loaded!");

// // Acquire temperatures from the database and display them.
async function getTemperatures() 
{
    try 
	{
        const response = await fetch('/rooms/temperature');
        const data = await response.json();

        data.forEach(room => 
		{
            const tempElement = document.getElementById(`${room.roomName.toLowerCase().replace(/\s+/g, '-')}-temp`);
            if (tempElement) 
			{
                tempElement.textContent = `${room.temperature}°C`;
            }
        });
    } catch (error) 
	{
        console.error("Error fetching temperatures.", error);
    }
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
