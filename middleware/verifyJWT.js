// Whenever the user wants to access a protected route or resource, the user agent should send the JWT,
// typically in the Authorization header using the Bearer schema.
// Authorization: Bearer <token>
// If the token is sent in the Authorization header,

const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401); // Unauthorized
  console.log(authHeader); // Bearer token
  const token = authHeader.split(" ")[1]; // authHeader = "Bearer token"
  // verify the token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); // Forbidden (invalid token)
    req.user = decoded.username;
    // If the token is valid, it extracts the username from the decoded token
    // and attaches it to the request object for use in subsequent middleware or routes.
    next(); // continue to the next middleware or route
  });
};

module.exports = verifyJWT;
