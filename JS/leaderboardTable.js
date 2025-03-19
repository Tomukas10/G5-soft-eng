// This file handles the frontend element of leadership.HTML.

// Fetches the latest values from the leaderboard to be displayed.
async function getLeaderboard()
{
	try
	{
	const response = await fetch('/leaderboard');
	if (!response.ok) throw new Error(`Http error! Status: ${response.status}`);
	
	const leaderboardData = await response.json();
	console.log("Leaderboard data has been retrieved:", leaderboardData); // Optional debug message in event of error.
	
	// Anchors the output to the relevant table.
	const leaderboardContainer = document.querySelector("#leaderboard-table tbody");
	leaderboardContainer.innerHTML = "";
	
	// If there's nothing currently present in the leaderboard table, notify.
	if (leaderboardData.length === 0) 
		{
	    leaderboardContainer.innerHTML = `<tr><td colspan="4" style="text-align:center;">No leaderboard data available</td></tr>`;
	    return;
		}
	
	leaderboardData.forEach(row => {
	    const tr = document.createElement("tr");
	    tr.innerHTML = `
	        <td>${row.users || "No Users"}</td>
	        <td>${row.house_name}</td>
            <td>${row.total_energy.toFixed(2)} kWh</td>
	        <td>${row.rank}</td>
	    `;
	    leaderboardContainer.appendChild(tr);
	});
	} catch (error) {console.error("Error fetching the leaderboard!", error);}
}


// Runs the 'getLeaderboard' function when the page loads.
document.addEventListener("DOMContentLoaded", () => 
	{
    getLeaderboard();
//    setInterval(getLeaderboard, 10000); // Refresh every 10 seconds
	});

