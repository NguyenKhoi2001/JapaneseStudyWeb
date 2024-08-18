const mongoose = require("mongoose");

const kanjiSchema = new mongoose.Schema({
  character: {
    type: String,
    required: true,
  },
  meaning: {
    jp: { type: String },
    en: { type: String },
    vi: { type: String, required: true },
  },
  sinoVietnameseSounds: {
    type: String,
  },
  onyomi: [String],
  kunyomi: [String],
  examples: [
    {
      kanjiWord: String,
      hiragana: String,
      meaning: {
        en: { type: String },
        vi: { type: String, required: true },
      },
    },
  ],
  imageUrl: {
    type: String,
    default: "",
  },
  imagePublicId: { type: String, default: "" },
});

const Kanji = mongoose.model("Kanji", kanjiSchema);

module.exports = Kanji;
