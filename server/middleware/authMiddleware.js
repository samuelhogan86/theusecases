const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1] : null;

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

const tokenValidator = (req, res, next) => {
    try{

        const authHeader = req.headers.authorization;
        if (!authHeader){
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        const token = authHeader.split(" ")[1];
        if(!token){
            return res.status(401).json({ error: "Invalid format for token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    }
    catch (err) {
        return res.status(401).json({ error: "Invalid/expired token" });
    }
};

const checkIfAdmin = (req, res, next) => {
    try{
        if (req.user.role !== "admin") {
            return res.status(401).json({ error: "Admin only function" })
        }
        next();
    }
    catch (err) {
        return res.status(401).json({ error: "Invalid Role" });
    }
};


module.exports = { requireAuth, tokenValidator, checkIfAdmin };