const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../db/models/User");

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    const error = new Error();
    error.statusCode = 403;
    error.customMessage = "Incorrect username or password";

    next(error);
  }
  const correctPassword = await bcrypt.compare(password, user.password);
  if (!correctPassword) {
    const error = new Error();
    error.statusCode = 403;
    error.customMessage = "Incorrect username or password";

    next(error);
  }

  const userData = {
    username,
    id: user.id,
  };
  const token = jwt.sign(userData, process.env.JWT_SECRET);

  res.status(200).json({ token });
};

module.exports = { loginUser };
