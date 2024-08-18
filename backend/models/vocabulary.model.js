const mongoose = require("mongoose");

const vocabularySchema = new mongoose.Schema({
  hiraganaKatakana: {
    type: String,
    required: true,
  },
  meanings: {
    en: [{ type: String }],
    vi: [{ type: String }],
  },
  kanji: {
    type: String,
    default: null,
  },
  sinoVietnameseSounds: {
    type: String,
    required: false,
  },
  imageUrl: {
    type: String,
    default: "",
  },
  imagePublicId: { type: String, default: "" },

  examples: [
    {
      sentence: { type: String, required: true },
      meaning: {
        en: { type: String },
        vi: { type: String, required: true },
      },
    },
  ],
});

const Vocabulary = mongoose.model("Vocabulary", vocabularySchema);

module.exports = Vocabulary;
