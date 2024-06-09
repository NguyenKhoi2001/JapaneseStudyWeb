const Vocabulary = require("../models/vocabulary.model");
const Lesson = require("../models/lesson.model");

// Add a new vocabulary
exports.addVocabulary = async (req, res) => {
  try {
    const newVocabulary = new Vocabulary(req.body);
    const savedVocabulary = await newVocabulary.save();
    res.status(201).json({ success: true, data: savedVocabulary });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: error.message } });
  }
};

// Get all vocabularies
exports.getAllVocabularies = async (req, res) => {
  try {
    const vocabularies = await Vocabulary.find();
    res.status(200).json({ success: true, data: vocabularies });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

// Get a single vocabulary by ID
exports.getVocabularyById = async (req, res) => {
  try {
    const vocabulary = await Vocabulary.findById(req.params.id);
    if (vocabulary) {
      res.status(200).json({ success: true, data: vocabulary });
    } else {
      res
        .status(404)
        .json({ success: false, error: { message: "Vocabulary not found!" } });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

// Update a vocabulary by ID
exports.updateVocabulary = async (req, res) => {
  try {
    const updatedVocabulary = await Vocabulary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedVocabulary });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: error.message } });
  }
};

// Delete a vocabulary by ID
exports.deleteVocabulary = async (req, res) => {
  try {
    const vocabId = req.params.id;

    // First, find the Vocabulary document to ensure it exists
    const vocabulary = await Vocabulary.findById(vocabId);
    if (!vocabulary) {
      return res
        .status(404)
        .json({ success: false, error: { message: "Vocabulary not found." } });
    }

    // Delete the vocabulary document
    await Vocabulary.findByIdAndDelete(vocabId);

    // Now, remove the deleted vocabulary's ID from all lessons' vocabularies array
    await Lesson.updateMany({}, { $pull: { vocabularies: vocabId } });

    res.status(200).json({
      success: true,
      data: {
        message:
          "Vocabulary successfully deleted and references removed from lessons.",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};
