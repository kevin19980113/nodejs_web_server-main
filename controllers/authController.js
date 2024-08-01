const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const bcrypt = require("bcrypt");

// ->> jwt.sign() generates a signed token (header + payload + signature)
// signature: created by encoded header, encoded payload, and a secret
// Signed tokens can verify the integrity of the claims contained within it
// the signature also certifies that only the party holding the private key(secret) is the one that signed it.
const jwt = require("jsonwebtoken");
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400) // status 400 means bad request
      .json({ error: "Username and password are required" });
  const foundUser = usersDB.users.find((person) => person.username === user);
  if (!foundUser) {
    return res.sendStatus(401); // status 401 means authentication
  }

  const match = await bcrypt.compare(pwd, foundUser.password);
  // if passwords match(authenticated), create(sign) and send JWTs(Json Web Tokens)

  // Access tokens are tokens that give users access to the protected resources.
  // usually short-lived (e.g., 15 minutes)
  // Refresh tokens are tokens that allow users to request new access tokens.
  // usually long-lived
  // when user log in, create an access token and a refresh token
  if (match) {
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles,
        },
      },
      // payload which contains the claims. Claims are statements about an entity (typically, the user) and additional data.
      // Do not put secret information in the payload or header elements of a JWT unless it is encrypted.
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const otherUsers = usersDB.users.filter(
      (person) => person.username !== foundUser.username
    );
    // update usersDB with updated currently logged in User with refreshToken (send refresh token to server(DB))
    const currentUser = { ...foundUser, refreshToken };
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    // store refreshToken in cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true, // httpOnly cookie is not allowable to be accessed by scripts injection (protect against XSS attacks)
      sameSite: "Strict", // sameSite: "Strict" - protect CSRF(cross-site) Attack
      // secure: true (dev server - http) (production server - https) to protect against XSS attacks
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });

    console.log(`Logged in: ${foundUser.username} successfully!`);
    res.json({ accessToken }); // send response with access token to the front-side
  } else {
    res.sendStatus(401); // Unauthenticated
  }
};

// how do I use cookies to persists my tokens?
// Store your access token in memory(variable - front-end) and store your refresh token in the cookie

// Step 1: Return Access Token and Refresh Token when the user is authenticated.
// The access_token will be included in the Response body
// and the refresh_token will be included in the cookie. (also send it to server(DB))
// Use the httpOnly flag to prevent JavaScript from reading it.(XSS attacks)
// Use the secure=true flag so it can only be sent over HTTPS.
// Use the sameSite=Strict flag to prevent CSRF attacks.

// Step 2: Store the access token in memory
// Storing the token in-memory means that you put this access token in a variable in your front-end site.
// this means that the access token will be gone if the user switches tabs or refresh the site.
// That's why we have the refresh token.

// Step 3: Renew access token using the refresh token
// When the access token is gone or has expired, hit the "/refresh" endpoint and the refresh token that was stored in the cookie

module.exports = {
  handleLogin,
};
