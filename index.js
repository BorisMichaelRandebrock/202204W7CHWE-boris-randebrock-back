require("dotenv").config();
const debug = require("debug")("redsocial:root");
const chalk = require("chalk");
const connectDb = require("./db");
const initialServer = require("./server/initialServer");

(async () => {
  try {
    // await connectDb(process.env.MONGO_PORT);
    await initialServer(process.env.SERVER_PORT || 4050);
    debug(chalk.greenBright("server connected"));
  } catch (error) {
    debug(chalk.redBright("error connecting database"));
  }
})();
