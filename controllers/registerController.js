const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  //check for duplicate usernames in the db
  const existingUser = usersDB.users.find((person) => person.username === user);
  if (existingUser)
    return res.status(409).json({ error: "Username already exists" }); // status 409 means conflict
  try {
    //encrypt(hash password) the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    //store the user in the db
    const newUser = {
      username: user,
      roles: { User: 2001 },
      password: hashedPwd,
    };
    usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users) // JS object -> JSON
    );
    console.log(usersDB.users);
    res.status(201).json({ success: `new User ${user} created!` }); // status 201 means created new one
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  handleNewUser,
};
