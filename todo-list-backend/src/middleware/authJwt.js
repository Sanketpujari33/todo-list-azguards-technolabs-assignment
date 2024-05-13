const jwt = require("jsonwebtoken");
const User = require("../models/user");
// Middleware to verify the user's token
async function verifyToken(req, res, next) {
    try {
        let token;
        // Check if the request has an Authorization header with a Bearer token
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]; // Corrected the token extraction
        }
        if (!token) return res.status(401).json({ message: "No token provided" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.userId = decoded.id;

        const user = await User.findById(req.userId, { password: 0 });
        if (!user) return res.status(404).json({ message: "Expire token No user found" });
        next(); // Proceed to the next middleware
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Unauthorized" });
    }
};

module.exports = {
    verifyToken
}