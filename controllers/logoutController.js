const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");

const handleLogout = async (req, res) => {
  // On client-side(front-end), also delete the accessToken
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No Content (that's fine)
  const refreshToken = cookies.jwt;

  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  ); // find user by refreshToken
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "Strict" });
    // secure: true - only serves on https (dev server - http) (production server - https)
    return res.sendStatus(204);
  }

  // Delete refresh token from users DB
  const otherUsers = usersDB.users.filter(
    (person) => person.username !== foundUser.username
  );
  const currentUser = { ...foundUser, refreshToken: null };
  usersDB.setUsers([...otherUsers, currentUser]);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "users.json"),
    JSON.stringify(usersDB.users)
  );

  res.clearCookie("jwt", { httpOnly: true, sameSite: "Strict" });
  res.sendStatus(204);
};

module.exports = {
  handleLogout,
};
