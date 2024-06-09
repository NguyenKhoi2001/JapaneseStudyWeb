const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  vocabularies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vocabulary",
    },
  ],
  kanjis: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kanji",
    },
  ],
  grammars: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Grammar",
    },
  ],
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
});

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;
