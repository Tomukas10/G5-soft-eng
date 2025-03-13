const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { query } = require('./db'); // Import database functions
const authenticateToken = require('./authMiddleware'); // Import authentication middleware
const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');

const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Serve static files
app.use('/css', express.static(path.join(__dirname, '../CSS')));
app.use('/js', express.static(path.join(__dirname, '../JS')));
app.use(express.static(path.join(__dirname, '../HTML')));

// Load authentication and profile routes
console.log('Loading authRoutes...');
app.use('/auth', authRoutes);
console.log('authRoutes loaded!');

app.use('/user', profileRoutes);

// Serve index.html at the root URL
app.get('/', (req, res) => {
  console.log('Serving file from:', path.join(__dirname, '../HTML/index.html'));
  res.sendFile(path.join(__dirname, '../HTML/index.html'));
});

// Get list of landlords
app.get('/users', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM landlords');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get rooms of a house
app.get('/houses/:houseId/rooms', async (req, res) => {
  const { houseId } = req.params;
  try {
    const rooms = await query('SELECT * FROM rooms WHERE house_id = ?', [houseId]);
    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get the next available room ID
app.get('/houses/:houseId/nextRoomId', async (req, res) => {
  const { houseId } = req.params;
  try {
    const rooms = await query('SELECT id FROM rooms WHERE house_id = ?', [houseId]);
    const nextRoomId = rooms.length > 0 ? Math.max(...rooms.map(room => room.id)) + 1 : 1;
    res.json({ nextRoomId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Add a new room
app.post('/houses/:houseId/rooms', async (req, res) => {
  const { houseId } = req.params;
  const { id, name } = req.body;
  try {
    await query('INSERT INTO rooms (house_id, id, name) VALUES (?, ?, ?)', [houseId, id, name]);
    res.status(201).json({ message: 'Room added successfully', id, name });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete a room
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

app.get('/devices', async (req, res) => {
    try {
        const devices = await query('SELECT id, name, state, powerusage FROM devices');
        res.json(devices);
    } catch (error) {
        console.error('Error fetching devices:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Get devices for a room
app.get('/houses/:houseId/rooms/:roomId/devices', async (req, res) => {
  const { roomId } = req.params;
  try {
    const devices = await query('SELECT * FROM devices WHERE room_id = ?', [roomId]);
    res.json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).send('Error fetching devices');
  }
});

// Get unassigned devices
app.get('/devices/unassigned', async (req, res) => {
  try {
    const devices = await query('SELECT id, name FROM devices WHERE room_id IS NULL');
    res.json(devices);
  } catch (error) {
    console.error('Error fetching unassigned devices:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update a device's room assignment
app.patch('/devices/:deviceId', async (req, res) => {
  const { deviceId } = req.params;
  const { room_id } = req.body;
  try {
    await query('UPDATE devices SET room_id = ? WHERE id = ?', [room_id, deviceId]);
    res.send('Device updated successfully');
  } catch (error) {
    console.error('Error updating device:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Set room_id to NULL for devices when a room is deleted
app.patch('/houses/:houseId/rooms/:roomId/devices', async (req, res) => {
  const { roomId } = req.params;
  try {
    await query('UPDATE devices SET room_id = NULL WHERE room_id = ?', [roomId]);
    res.status(200).send('Devices updated successfully.');
  } catch (error) {
    console.error('Error updating devices:', error);
    res.status(500).send('Error updating devices.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
