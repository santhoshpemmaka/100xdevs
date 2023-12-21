const jwt = require('jsonwebtoken');
const JWT_PASSWORD = "100xdev";

function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const token = req.headers.token;
    if (!token) {
        return res.status(403).json({
            message : "UnAuthorized request"
        })
    }
    const verifyPassword = jwt.verify(token, JWT_PASSWORD);
    req.userpassword = verifyPassword.password;
    if (verifyPassword.password) {
        next();
    }
    else {
        return res.status(403).json({
            message : "Invalid credentials"
        })
    }


}

module.exports = userMiddleware;