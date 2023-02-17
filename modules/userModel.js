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
    cards: [
      {
        title: {
          type: String,
        },
        difficulty: {
          type: String,
          enum: ["easy", "normal", "hard"],
          default: "normal",
        },
        date: {
          type: String,
          default: "Today",
        },
        time: {
          type: String,
        },
        status: {
          type: String,
          enum: ["Incomplete", "Complete"],
          default: "Incomplete",
        },
        category: {
          type: String,
          enum: ["stuff", "family", "health", "learning", "leisure", "work"],
          default: "stuff",
        },
        type: { type: String },
      },
    ],
  })
);

module.exports = User;
