const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(403).json({ message: "Access Denied: No Token Provided" });
    }

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET || "default_secret");
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid or Expired Token" });
    }
}

module.exports = authenticateToken;
