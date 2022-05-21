const chalk = require("chalk");
const debug = require("debug");

const notFoundError = (req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
  debug("no va aqui");
};

// eslint-disable-next-line no-unused-vars
const generalError = (error, req, res, next) => {
  debug(chalk.redBright(`Error: ${error.message}`));
  const errorCode = error.code ?? 500;
  const errorMessage = error.code ? error.message : "Major General Peter";
  res.status(errorCode).json({ message: errorMessage });
};

module.exports = {
  notFoundError,
  generalError,
};
