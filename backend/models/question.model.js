const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  answers: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"] },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
