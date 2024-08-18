const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  title: { type: String, required: false, default: "" },
  htmlContent: { type: String, required: false, default: "" },
});

const grammarSchema = new mongoose.Schema(
  {
    jp: { type: contentSchema, required: false },
    en: { type: contentSchema, required: false },
    vi: {
      type: contentSchema,
      required: [true, "Vietnamese content is required"],
    },
  },
  { timestamps: true }
);

const Grammar = mongoose.model("Grammar", grammarSchema);

module.exports = Grammar;
