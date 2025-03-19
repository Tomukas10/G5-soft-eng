// Allows the leaderboard to interact with the DB directly.
const {query} = require('./db');

// Updates the leaderboard with the latest values.
async function updateLeaderboard()
{
	try 
	{
		// Clears out any existing leaderboard table data.
		await query(`DELETE FROM leaderboard`);
		
		// Acquires total energy consumption from 'temperature', 'lighting', 'devices' based on house_id and ranks the houses accordingly.
		const leaderboardData = await query
		(`
			SELECT 
			    h.id AS house_id,
			    h.name AS house_name,
			    GROUP_CONCAT(u.name SEPARATOR ', ') AS users,
			    COALESCE(SUM(d.powerUsage), 0) AS total_energy,
			    RANK() OVER (ORDER BY COALESCE(SUM(d.powerUsage), 0) ASC) AS rank
			FROM houses h
			JOIN users u ON h.id = u.house_id AND u.user_type = 'user'
			LEFT JOIN devices d ON h.id = d.house_id
			GROUP BY h.id
			ORDER BY total_energy ASC;
		`);		
		
		// Inserts fresh leaderboard data as queried above.
		for (const row of leaderboardData) 
			{
		    await query(`
		        INSERT INTO leaderboard (house_id, house_name, users, total_energy, rank)
		        VALUES (?, ?, ?, ?, ?)`,
		        [row.house_id, row.house_name, row.users, row.total_energy, row.rank]
		    );
		}
		
		console.log('Leaderboard has been successfully updated!');
	} catch (err)
	{
		console.error('Error updating the leaderboard:', err);
	}
}

// Allows server.JS to access the updateLeaderboard function.
module.exports = { updateLeaderboard };