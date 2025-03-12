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
app.get('/', (req, res) => {
    console.log('Serving file from:', path.join(__dirname, '../HTML/index.html'));
    res.sendFile(path.join(__dirname, '../HTML/index.html'));
});

app.get('/users', async (req, res) => {
    try {
        const rows = await query('SELECT * FROM `landlords`'); // Use backticks
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.get('/houses/:houseId/rooms', async (req, res) => {
    const houseId = req.params.houseId; // Get houseId from the URL

    try {
        const rooms = await query('SELECT * FROM rooms WHERE house_id = ?', 1/*[houseId]*/);
        res.json(rooms); // Send the rooms as JSON
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Get the next available room ID (based on existing rooms)
app.get('/houses/:houseId/nextRoomId', async (req, res) => {
    const houseId = req.params.houseId;

    try {
        // Get all room IDs for this house
        const rooms = await query('SELECT id FROM rooms WHERE house_id = ?', 1);

        // Find the next available room ID by incrementing the maximum existing room ID
        const nextRoomId = rooms.length > 0
            ? Math.max(...rooms.map(room => room.id)) + 1
            : 1; // If no rooms exist, start from 1

        res.json({ nextRoomId }); // Return the next available room ID
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Add a new room
app.post('/houses/:houseId/rooms', async (req, res) => {
    const house_id = req.params.houseId;
    const {id, name} = req.body; // Expecting roomId and roomName in the request body

    try {
        // Insert the new room into the database
        await query('INSERT INTO rooms (house_id, id, name) VALUES (?, ?, ?)', [1, id, name]);

        // Respond with a success message
        res.status(201).json({ message: 'Room added successfully', id, name });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.delete('/houses/:houseId/rooms/:roomId', async (req, res) => {
    const { houseId, roomId } = req.params;

    try {
        await query('DELETE FROM rooms WHERE house_id = ? AND id = ?', [houseId, roomId]);
        res.status(200).send({ message: 'Room deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Failed to delete room' });
    }
});

app.get('/houses/:houseId/rooms/:roomId/devices', async (req, res) => {
    const { houseId, roomId } = req.params; // Get houseId and roomId from the URL params
    
    try {
        // Query the devices based on room_id
        const devices = await query('SELECT * FROM devices WHERE room_id = ?', [roomId]);

        res.json(devices); // Send the devices as JSON response
    } catch (error) {
        console.error('Error fetching devices:', error);
        res.status(500).send('Error fetching devices');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});