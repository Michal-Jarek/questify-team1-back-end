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
  })
);

const Session = model(
  "session",
  new Schema({
    uid: String,
  })
);

module.exports = { User, Session };
