// Whenever the user wants to access a protected route or resource, the user agent should send the JWT,
// typically in the Authorization header using the Bearer schema.
// Authorization: Bearer <token>
// If the token is sent in the Authorization header,

const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401); // Unauthorized
  const token = authHeader.split(" ")[1]; // Bearer token
  // verify the token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); // Forbidden (invalid access token)
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    // If the access token is valid, it extracts the username from the decoded token
    // and attaches it to the request object for use in subsequent middleware or routes.
    next();
  });
};

module.exports = verifyJWT;
