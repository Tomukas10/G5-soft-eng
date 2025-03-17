const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { query } = require('./db'); // Import database functions
const authenticate = require('./authMiddleware'); // Import authentication middleware
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
    const rows = await query(`SELECT * FROM users WHERE user_type = 'landlord'`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get rooms of a house
app.get('/houses/rooms', authenticate, async (req, res) => {
  const house_id = req.user.house_id;  // Access house_id from the authenticated user in the token

  try {
      const rooms = await query('SELECT * FROM rooms WHERE house_id = ?', [house_id]);
      res.json(rooms);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});

// Get houses
app.get('/houses', authenticate, async (req, res) => {
  const user_id = req.user.id;  // Access house_id from the authenticated user`s token
  try {
    const houses = await query('SELECT * FROM houses WHERE landlord_id = ?', [user_id]);
    res.json(houses);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Add a new house
app.post('/houses', authenticate,async (req, res) => {
  const landlord_id = req.user.id;
  const { name } = req.body; 
  const { address } = req.body;
  try {
    const result = await query('INSERT INTO houses (name, address, landlord_id) VALUES (?, ?, ?)', [name, address, landlord_id]);
    
    
    res.status(201).json({
      message: 'Room added successfully',
      name
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// Add a new device
app.post('/devices', authenticate,async (req, res) => {
  const user_Id = req.user.house_id;
  const { name } = req.body; 
  const { type } = req.body;
  const { room_id } = req.body;
  



  try {
    const result = await query('INSERT INTO devices (name, type, room_id, state, powerUsage, house_id) VALUES (?, ?, ?, 0, 20, ?)', [name, type, room_id, user_Id]);
    
    res.status(201).json({
      message: 'Device added successfully',
      name
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete a house
app.delete('/houses/:houseId', async (req, res) => {
  const { houseId } = req.params;
  try {
    await query('DELETE FROM houses WHERE id = ?', [houseId]);
    res.status(200).send({ message: 'Room deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Failed to delete room' });
  }
});

// Add a new room
app.post('/houses/houseId/rooms', authenticate, async (req, res) => {
  const house_id = req.user.house_id;
  const { name } = req.body; 
  try {
    const result = await query('INSERT INTO rooms (house_id, name) VALUES (?, ?)', [house_id, name]);
    
    
    res.status(201).json({
      message: 'Room added successfully',
      name
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete a room
app.delete('/rooms/:roomId', async (req, res) => {
  const { roomId } = req.params;
  try {
    await query('DELETE FROM rooms WHERE id = ?', [roomId]);
    res.status(200).send({ message: 'Room deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Failed to delete room' });
  }
});

// Get Total Power for all device month combo (deviceid, month, total power for that device in the month)

app.get('/totPower/device/month', async (req, res) => {
  try {
    const totPower = await query('SELECT devices.id, devices.name, MONTH(sesstart) AS month, SUM(powerUsage * TIMESTAMPDIFF(SECOND, sesstart, sesend) ) AS power FROM sessions INNER JOIN devices ON devices.id = sessions.deviceid WHERE sesend IS NOT NULL GROUP BY devices.name, MONTH(sesstart);');
    res.json(totPower);
  } catch (error) {
    console.error('Error fetching total power:', error);
    res.status(500).send('Error fetching total power');
  }
});

// Get Total Power for all device month combo (deviceid, month, total power for that device in the month) Also takes in a userid

app.get('/totPower/device/month/:user', async (req, res) => {
  const { user } = req.params;
  try {
    const totPower = await query('SELECT devices.id, devices.name, MONTH(sesstart) AS month, SUM(powerUsage * TIMESTAMPDIFF(SECOND, sesstart, sesend) ) AS power FROM (sessions INNER JOIN users ON users.id = sessions.userid) INNER JOIN devices ON devices.id = sessions.deviceid WHERE sesend IS NOT NULL AND users.id = ? GROUP BY devices.name, MONTH(sesstart);', [user]);
    res.json(totPower);
  } catch (error) {
    console.error('Error fetching total power:', error);
    res.status(500).send('Error fetching total power');
  }
});

// Get Total Power for all user month combo (userid, month, total power for that user in the month)

app.get('/totPower/user/month', async (req, res) => {
  try {
    const totPower = await query('SELECT users.id, users.name, MONTH(sesstart) AS month, SUM(powerUsage * TIMESTAMPDIFF(SECOND, sesstart, sesend) ) AS power FROM (sessions INNER JOIN users ON users.id = sessions.userid) INNER JOIN devices ON devices.id = sessions.deviceid WHERE sesend IS NOT NULL GROUP BY users.name, MONTH(sesstart);');
    res.json(totPower);
  } catch (error) {
    console.error('Error fetching total power:', error);
    res.status(500).send('Error fetching total power');
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
app.get('/houses/houseId/rooms/:roomId/devices', authenticate, async (req, res) => {
  const { roomId } = req.params;
  const house_id = req.user.house_id;
  try {
    const devices = await query('SELECT * FROM devices WHERE room_id = ? AND house_id = ?', [roomId, house_id]);
    res.json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).send('Error fetching devices');
  }
});

// Get unassigned devices
app.get('/houses/devices/unassigned', authenticate, async (req, res) => {
  try {
    const house_id = req.user.house_id;  // Access house_id directly from req.user
    const devices = await query('SELECT id, name FROM devices WHERE room_id IS NULL AND house_id = ?', [house_id]);
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
app.patch('/rooms/:roomId/devices', async (req, res) => {
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
