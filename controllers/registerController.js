const UserDB = require("../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  //check for duplicate usernames in the db
  const existingUser = await UserDB.findOne({ username: user }).exec();
  if (existingUser)
    return res.status(409).json({ error: "Username already exists" }); // status 409 means conflict
  try {
    //encrypt(hash password) the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    //store the user in the db
    const result = await UserDB.create({
      username: user,
      password: hashedPwd,
    });

    console.log(result);

    res.status(201).json({ success: `new User ${user} created!` }); // status 201 means created new one
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  handleNewUser,
};
