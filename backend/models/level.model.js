const mongoose = require("mongoose");

const levelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lessons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
  ],
});

const Level = mongoose.model("Level", levelSchema);

module.exports = Level;
