const UserDB = require("../model/User");

// LOGOUT:
// delete refresh token from users DB(Server) and cookie
// delete access token from memory(fornt-side)
const handleLogout = async (req, res) => {
  // On client-side(front-end), also delete the accessToken
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No Content (that's fine)
  const refreshToken = cookies.jwt;

  const foundUser = await UserDB.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "Strict" });
    // secure: true - only serves on https (dev server - http) (production server - https)
    return res.sendStatus(204);
  }
  // Delete refresh token from users DB(Server)
  foundUser.refreshToken = null;
  const result = await foundUser.save();
  console.log(`Logged out: ${result.username} successfully!`);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "Strict" }); // delete cookie
  res.sendStatus(204);
};

module.exports = {
  handleLogout,
};
