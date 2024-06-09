// userProgress model
const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
  },
  score: { type: Number, required: true },
  passed: { type: Boolean, required: true, default: false },
  dateAttempted: { type: Date, default: Date.now },
});

userProgressSchema.pre("save", function (next) {
  this.passed = this.score >= 70;
  next();
});

const UserProgress = mongoose.model("UserProgress", userProgressSchema);

module.exports = UserProgress;
