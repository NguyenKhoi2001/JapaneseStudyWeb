const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: {
      jp: { type: String, required: false },
      en: { type: String, required: false },
      vi: { type: String, required: [true, "Vietnamese title is required"] },
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
  },
  { timestamps: true }
);

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;
