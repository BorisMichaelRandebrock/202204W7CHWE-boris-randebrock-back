require("dotenv").config();
const debug = require("debug")("redsocial:root:server");
const chalk = require("chalk");
const app = require(".");

const initialServer = (port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.greenBright(`initial server on port online ${port}`));
      resolve();
    });

    server.on("error", (error) => {
      debug(chalk.redBright("error in server"));
      if (error.code === "EADDRINUSE") {
        debug(`${port} in use.`);
      }
      reject();
    });
  });

module.exports = initialServer;
