require("dotenv").config();
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const debug = require("debug")("redsocial:server:controllers:userControllers");
const User = require("../../db/models/User");

const userRegister = async (req, res, next) => {
  const {
    name: newName,
    username: newUsername,
    password: newPassword,
    email: newEmail,
  } = req.body;

  const { file } = req;

  const prefixImage = Date.now();
  try {
    const user = await User.findOne({ username: newUsername });

    if (!user) {
      fs.rename(
        path.join("uploads", "images", "users", file.filename),
        path.join(
          "uploads",
          "images",
          "users",
          `${prefixImage}-${file.originalname}`
        ),
        (error) => {
          if (error) {
            next(error);
          }
        }
      );
      const newImage = `images/users/${prefixImage}-${file.originalname}`;
      const cryptedPassword = await bcrypt.hash(newPassword, 10);
      const newUser = {
        name: newName,
        username: newUsername,
        email: newEmail,
        password: cryptedPassword,
        image: newImage,
        friends: [],
        enemies: [],
      };
      const currentUserCreated = await User.create(newUser);
      res.status(201).json({ user: currentUserCreated });
    } else {
      const userError = new Error();
      userError.code = 409;
      userError.message = "Error, this username already exist";
      next(userError);
    }
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    const error = new Error();
    error.statusCode = 403;
    debug("user incorrect");
    error.customMessage = "Incorrect username or password";

    next(error);
  }
  const correctPassword = await bcrypt.compare(password, user.password);

  if (!correctPassword) {
    const error = new Error("password");
    error.statusCode = 403;
    error.customMessage = "Incorrect username or password";

    next(error);
  }

  const userData = {
    username,
    id: user.id,
  };
  const token = jwt.sign(userData, process.env.JWT_SECRET);
  debug("welcome");
  res.status(200).json({ token });
};

module.exports = { userRegister, loginUser };
