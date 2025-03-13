const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { query } = require('./db'); // Import database functions
const authenticateToken = require('./authMiddleware'); // Import authentication middleware
const authRoutes = require("./authRoutes");  // Import authRoutes in the correct place!
const profileRoutes = require("./profileRoutes"); // Import profile routes

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
console.log("✅ Loading authRoutes...");
app.use("/auth", authRoutes);  
console.log("✅ authRoutes loaded!");

app.use("/user", profileRoutes);

// Serve index.html at the root URL
app.get('/', (req, res) => {
    console.log('Serving file from:', path.join(__dirname, '../HTML/index.html'));
    res.sendFile(path.join(__dirname, '../HTML/index.html'));
});

// USER AUTHENTICATION ROUTES 
// User Registration
app.post('/auth/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: '❌ Email already registered!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

        res.status(201).json({ message: '✅ User registered successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '❌ Error registering user', error: err });
    }
});

// User Login
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const users = await query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: '❌ Invalid email or password' });
        }

        const user = users[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: '❌ Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "default_secret", { expiresIn: '1h' });
        res.json({ message: '✅ Login successful!', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '❌ Error logging in', error: err });
    }
});

// USER PROFILE MANAGEMENT ROUTES 
// Get User Profile (Protected Route)
app.get('/user/profile', authenticateToken, async (req, res) => {
    try {
        const results = await query('SELECT id, name, email FROM users WHERE id = ?', [req.user.id]);
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });

        res.json(results[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching user profile', error: err });
    }
});

// Update User Profile (Protected Route)
app.put('/user/profile', authenticateToken, async (req, res) => {
    const { username, email } = req.body;
    try {
        await query('UPDATE users SET name = ?, email = ? WHERE id = ?', [username, email, req.user.id]);
        res.json({ message: '✅ Profile updated successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '❌ Error updating profile', error: err });
    }
});

// EXISTING ROUTES 
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
    const houseId = req.params.houseId;
    try {
        const rooms = await query('SELECT * FROM rooms WHERE house_id = ?', [houseId]);
        res.json(rooms);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Add a new room
app.post('/houses/:houseId/rooms', async (req, res) => {
    const house_id = req.params.houseId;
    const { id, name } = req.body;
    try {
        await query('INSERT INTO rooms (house_id, id, name) VALUES (?, ?, ?)', [house_id, id, name]);
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

app.get('/devices/unassigned', async (req, res) => {
    try {
        const devices = await query('SELECT id, name FROM devices WHERE room_id IS NULL');
        res.json(devices);
    } catch (error) {
        console.error('Error fetching unassigned devices:', error);
        res.status(500).send('Internal Server Error');
    }
});

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
    const { houseId, roomId } = req.params;

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
    console.log(`✅ Server is running on http://localhost:${port}`);
});
