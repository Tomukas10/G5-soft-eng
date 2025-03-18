const express = require('express');
const path = require('path');

const { query } = require('./db'); // Import the query function

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Serve static files from the "CSS" folder
app.use('/css', express.static(path.join(__dirname, '../CSS')));

// Serve static files from the "JS" folder
app.use('/js', express.static(path.join(__dirname, '../JS')));

// Serve static files from the "HTML" folder
app.use(express.static(path.join(__dirname, '../HTML')));

// Route for the root URL
// - Changed from 'index.html' to 'overview.html' for the floor plan website.
app.get('/', (req, res) => {
    console.log('Serving file from:', path.join(__dirname, '../HTML/overview.html'));
    res.sendFile(path.join(__dirname, '../HTML/overview.html'));
});

// Fetch all the necessary room temperatures.
app.get('/rooms/temperature', async (req, res) => 
{
    try 
	{
        const rooms = await query('SELECT roomID, roomName, temperature FROM tempRooms');
		console.log(rooms); // Log data received from DB
        res.json(rooms); 
    } catch (err) 
	{
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Update the temperature for a specific room.
app.put('/rooms/:roomName/temperature', async (req, res) => 
{
    const { roomName } = req.params;
    const { temperature } = req.body;

    try 
	{
        await query('UPDATE tempRooms SET temperature = ? WHERE roomName = ?', [temperature, roomName]);
        res.status(200).json({ message: 'Temperature updated successfully' });
    } catch (err) 
	{
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Acquire all the room light states that aren't kitchen-specific.
app.get('/rooms/lights', async (req, res) => 
{
    try 
	{
        const lights = await query('SELECT roomID, roomName, mainLight FROM tempRooms');
        res.json(lights); // Return light states
    } catch (err) 
	{
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Acquire all the kitchen-specific lights.
app.get('/rooms/kitchen/lights', async (req, res) => 
{
    try 
	{
        const kitchenLights = await query('SELECT roomID, tableLight, barLight, counterLight FROM tempRooms WHERE roomName = "Kitchen"');
        res.json(kitchenLights);
    } catch (err) 
	{
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Toggles the main light in each room whenever a button is pressed.
app.put('/rooms/:roomName/mainLight', async (req, res) => 
{
    const { roomName } = req.params;
    const { state } = req.body; // Expecting { "state": true/false }

    try 
	{
        await query('UPDATE tempRooms SET mainLight = ? WHERE roomName = ?', [state, roomName]);
        res.status(200).json({ message: 'Main light updated successfully' });
    } catch (err) 
	{
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Toggles kitchen-specific lights whenever a button is pressed.
app.put('/rooms/kitchen/lights', async (req, res) => 
{
    const { lightType, state } = req.body; 

    if (!["tableLight", "barLight", "counterLight"].includes(lightType)) 
	{
        return res.status(400).json({ error: "Invalid light type" });
    }

    try 
	{
        const result = await query(`UPDATE tempRooms SET ${lightType} = ? WHERE roomName = "Kitchen"`, [state]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "No records updated, check lightType value" });
        }

        res.status(200).json({ message: `${lightType} updated successfully` });
    } 
	catch (err) 
	{
        console.error("SQL Error:", err);
        res.status(500).send('Server error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});