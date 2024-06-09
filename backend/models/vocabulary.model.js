const mongoose = require("mongoose");

const vocabularySchema = new mongoose.Schema({
  hiraganaKatakana: {
    type: String,
    required: true,
  },
  meanings: {
    en: [{ type: String }], // Array to support multiple meanings in English
    vi: [{ type: String }], // Array to support multiple meanings in Vietnamese
  },
  kanji: {
    type: String, // Nullable, for words without a Kanji representation
    default: null,
  },
  sinoVietnameseSounds: {
    type: String, // Conditional display based on language selection, not required
    required: false,
  },
  imageUrl: {
    type: String, // URL to an image that represents the vocabulary
    default: "",
  },
  examples: [
    {
      sentence: { type: String, required: true }, // Sentence using the vocabulary word
      meaning: {
        en: { type: String }, // English translation of the example
        vi: { type: String, required: true }, // Vietnamese translation of the example
      },
    },
  ],
});

const Vocabulary = mongoose.model("Vocabulary", vocabularySchema);

module.exports = Vocabulary;
