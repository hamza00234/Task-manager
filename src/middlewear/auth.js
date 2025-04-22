const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY; // Use your secret key here

module.exports = function authenticationMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication token is missing" });
    }

    // Verify the token
    jwt.verify(token, secretKey, (error, payload) => {
      if (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
      req.user = payload.user; // Attach user data to the request object
      next();
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Internal server error during authentication",
        error: error.message,
      });
  }
};
