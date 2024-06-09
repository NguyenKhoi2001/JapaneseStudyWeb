const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  htmlContent: { type: String, required: true },
});

const grammarSchema = new mongoose.Schema(
  {
    jp: { type: contentSchema, required: false }, // Not required
    en: { type: contentSchema, required: false }, // Not required
    vi: {
      type: contentSchema,
      required: [true, "Vietnamese content is required"],
    }, // Required
  },
  { timestamps: true }
);

const Grammar = mongoose.model("Grammar", grammarSchema);

module.exports = Grammar;
