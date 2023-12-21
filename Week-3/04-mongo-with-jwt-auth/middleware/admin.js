const jwt = require('jsonwebtoken');
const JWT_PASSWORD = "100xdev";
// Middleware for handling auth
function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const token = req.headers.token;
    if (!token) {
        return res.status(403).json({
            message : "Unauthorized user request"
        })
    }
    const verifyToken = jwt.verify(token, JWT_PASSWORD);

    if (verifyToken.password) {
        next();
    }
    else {
        return res.status(403).json({
            message : "Unauthorized user request"
        })
    }
}

module.exports = adminMiddleware;