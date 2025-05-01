const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY || 'thisismykey'; // Use your secret key here

module.exports = function authenticationMiddleware(req, res, next) {
  try {
    // Check if token exists in cookies
    const token = req.cookies.token;
    
    console.log("Received Token:", token);

    if (!token) {
      return res.status(401).json({ message: "Authentication token is missing" });
    }

    // Verify the token
    jwt.verify(token, secretKey, (error, payload) => {
      if (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      // Check the structure of the payload and ensure `user` is present
      if (!payload || !payload.user) {
        return res.status(401).json({ message: "Token payload is invalid" });
      }

      // Attach the user data (or other data) to req.user
      req.user = payload.user; // If `payload.user` is not correct, adjust accordingly
      next(); // Proceed to the next middleware/route handler
    });
  } catch (error) {
    // Return a 500 error if an internal error occurs
    res.status(500).json({
      message: "Internal server error during authentication",
      error: error.message,
    });
  }
};
