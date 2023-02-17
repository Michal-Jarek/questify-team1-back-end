const { model, Schema } = require("mongoose");

const Card = model(
  "card",
  new Schema({
    title: {
      type: String,
      required: [true, "Title is required"],
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
      enum: ["incomplete", "complete"],
      default: "incomplete",
    },
    category: {
      type: String,
      enum: ["stuff", "family", "health", "learning", "leisure", "work"],
      default: "stuff",
    },
    type: {
      type: String,
      enum: ["task", "challenge"],
      default: "task",
    },
  })
);

module.exports = Card;