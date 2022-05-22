const express = require("express");
const { loginUser } = require("../controllers/userControllers");

const usersRouter = express.Router();

usersRouter.post("/login", loginUser);

module.exports = usersRouter;
