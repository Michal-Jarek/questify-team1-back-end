const { model, Schema } = require("mongoose");

const User = model(
  "user",
  new Schema({
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    token: {
      type: String,
      default: null,
    },
  })
);

module.exports = User;