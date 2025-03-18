const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db");

const router = express.Router();

// User Registration
router.post("/register", async (req, res) => {
    const { fname, last_name, email, password, role } = req.body;

    try {
        // Check if user already exists
        const existingUser = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Email already registered!" });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        await db.query("INSERT INTO users (name, last_name, email, password, user_type) VALUES (?, ?, ?, ?, ?)", [fname, last_name, email, hashedPassword, role]);

        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Error registering user", error: err });
    }
});

// User Login
router.post("/login", async (req, res) => {
    const {fname, last_name, email, password } = req.body;

    try {
        // Find user in database
        const users = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = users[0];

        // Compare stored hashed password with provided password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user.id, email: user.email, user_type: user.user_type, house_id: user.house_id, invite: user.invite}, process.env.JWT_SECRET || "default_secret", { expiresIn: "1h" });

        res.json({ message: "Login successful!", token });
    } catch (err) {
        res.status(500).json({ message: "Error logging in", error: err });
    }
});

module.exports = router;
