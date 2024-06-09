const Kanji = require("../models/kanji.model");
const Lesson = require("../models/lesson.model");

// Add a new kanji
exports.addKanji = async (req, res) => {
  try {
    const newKanji = new Kanji(req.body);
    const savedKanji = await newKanji.save();
    res.status(201).json({ success: true, data: savedKanji });
  } catch (error) {
    console.log("error create kanji: " + error);
    res.status(400).json({ success: false, error: { message: error.message } });
  }
};

// Get all kanjis
exports.getAllKanjis = async (req, res) => {
  try {
    const kanjis = await Kanji.find();
    res.status(200).json({ success: true, data: kanjis });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

// Get a single kanji by ID
exports.getKanjiById = async (req, res) => {
  try {
    const kanji = await Kanji.findById(req.params.id);
    if (kanji) {
      res.status(200).json({ success: true, data: kanji });
    } else {
      res
        .status(404)
        .json({ success: false, error: { message: "Kanji not found!" } });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

// Update a kanji by ID
exports.updateKanji = async (req, res) => {
  try {
    const updatedKanji = await Kanji.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedKanji });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: error.message } });
  }
};

// Delete a kanji by ID
exports.deleteKanji = async (req, res) => {
  try {
    const kanjiId = req.params.id;
    const kanji = await Kanji.findById(kanjiId);
    if (!kanji) {
      return res
        .status(404)
        .json({ success: false, error: { message: "Kanji not found." } });
    }

    await Kanji.findByIdAndDelete(kanjiId);

    // Remove the deleted kanji's ID from all lessons' kanjis array
    await Lesson.updateMany({}, { $pull: { kanjis: kanjiId } });

    res.status(200).json({
      success: true,
      data: {
        message:
          "Kanji successfully deleted and references removed from lessons.",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};
