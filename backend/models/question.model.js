const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: { type: String },
  textAsking: {
    en: { type: String },
    vi: { type: String },
    jp: { type: String },
  },
  answers: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"] },
  lessons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
  ],
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
