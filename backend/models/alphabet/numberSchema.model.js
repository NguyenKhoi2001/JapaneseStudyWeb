const numberSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  inJapanese: { type: String, required: true },
  audioUrl: String,
});
