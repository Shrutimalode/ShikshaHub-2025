const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');
  let finalToken = token;

  // If no token in header, check query parameters (for direct links/viewing)
  if (!finalToken && req.query.token) {
    finalToken = req.query.token;
  }

  // Check if no token
  if (!finalToken) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(finalToken, process.env.JWT_SECRET || 'shikshahub_secret');
    
    // Add user from payload to request
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}; 