const chalk = require("chalk");
const mongoose = require("mongoose");
const debug = require("debug")("redsocial:db:root");

const connectDb = (connectString) =>
  new Promise((resolve, reject) => {
    mongoose.set("debug", true);
    mongoose.connect(connectString, (error) => {
      if (error) {
        debug(chalk.redBright("error in db root", error.message));
        reject();
        return;
      }
      debug(chalk.greenBright("database connected"));
      resolve();
    });
  });
module.exports = connectDb;
