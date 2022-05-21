const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  friends: {
    type: [{ type: Schema.Types.ObjectId }],
    ref: "User",
    default: [],
  },
  enemies: {
    type: [{ type: Schema.Types.ObjectId }],
    ref: "User",
    default: [],
  },
});

module.exports = model("User", UserSchema, "users");
