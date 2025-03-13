const express = require("express");
const db = require("./db");
const authenticate = require("./authMiddleware");

const router = express.Router();

// Get User Profile (Protected Route)
router.get("/profile", authenticate, async (req, res) => {
    try {
        const results = await db.query("SELECT id, name, email FROM users WHERE id = ?", [req.user.id]);
        if (results.length === 0) return res.status(404).json({ message: "User not found" });

        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ message: "Error fetching user profile", error: err });
    }
});

// Update User Profile (Protected Route)
router.put("/profile", authenticate, async (req, res) => {
    const { username, email } = req.body;

    try {
        await db.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [username, email, req.user.id]);
        res.json({ message: "Profile updated successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Error updating profile", error: err });
    }
});

module.exports = router;
