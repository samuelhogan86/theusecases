const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

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
        console.log("Auth Header Recieved: ", authHeader) //DEBUGGING ONLY
        if (!authHeader){
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        const token = authHeader.split(" ")[1]; //split token from Bearer
        if(!token){
            return res.status(401).json({ error: "Invalid format for token" });
        }
 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded)
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ error: "Invalid/expired token" });
    }
};


const requireRole = (role)=>{
    return(req, res, next)=>{
        if(req.user.role != role){
            return res.status(403).json({ error: "Invalid Role" });
        }
        next();
    };
};
module.exports = { requireAuth, tokenValidator , requireRole};