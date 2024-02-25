const mongoose = require("mongoose");

const alphabetSchema = new mongoose.Schema({
  type: { type: String, required: true },
  character: { type: String, required: true },
  romaji: { type: String, required: true },
  audioUrl: String,
  strokeOrder: String,
  category: { type: String, required: true },
});
