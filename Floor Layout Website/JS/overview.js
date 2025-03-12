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

        data.forEach(room => 
		{
            const lightImage = document.getElementById(`${room.roomName.toLowerCase().replace(/\s+/g, '-')}-mainLight`);
            if (lightImage) 
			{
                lightImage.style.filter = room.mainLight ? "brightness(100%)" : "brightness(30%)";
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
