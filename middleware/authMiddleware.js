const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.status(401).json({ error: 'Unauthorized - Invalid token' });
            } else {
                console.log(decodedToken);
                req.userId = decodedToken.id;
                next();
            }
        });
    } else {
        res.status(401).json({ error: 'Unauthorized - No token provided' });
    }
};

module.exports = { requireAuth };