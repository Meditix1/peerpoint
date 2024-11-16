const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get token from headers 
    const token = req.header('Authorization') && req.header('Authorization').startsWith('Bearer ') 
                  ? req.header('Authorization').split(' ')[1] // Extract token after "Bearer"
                  : null;

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_KEY); 
        req.user = decoded.user; 
        next(); 
    } catch (err) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
