const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'access denied. No token provided'
            });
        }
        const token = authHeader.replace('Bearer ', '')

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. Invalid token format.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError'){
            return res.status(401).json({
                success: false,
                message: 'Token has expired.'
            })
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success:
            })
        }
    }
};

module.exports = { authMiddleware, requireRole };