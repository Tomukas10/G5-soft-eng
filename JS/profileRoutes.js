const express = require("express");
const db = require("../config/db");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

// Get User Profile
router.get("/profile", authenticate, (req, res) => {
  db.query("SELECT id, username, email FROM users WHERE id = ?", [req.user.id], (err, results) => {
    if (results.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(results[0]);
  });
});

// Update User Profile
router.put("/profile", authenticate, (req, res) => {
  const { username, email } = req.body;
  db.query("UPDATE users SET username = ?, email = ? WHERE id = ?",
    [username, email, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error updating profile" });
      res.json({ message: "Profile updated successfully" });
    }
  );
});

module.exports = router;
