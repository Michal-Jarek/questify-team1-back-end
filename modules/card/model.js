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
    date: String,
    time: String,
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
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  })
);

module.exports = Card;
