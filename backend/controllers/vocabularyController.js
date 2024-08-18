const Vocabulary = require("../models/vocabulary.model");
const Lesson = require("../models/lesson.model");
const cloudinary = require("../utils/cloudinary"); // Ensure cloudinary is correctly imported

// Add a new vocabulary including image upload
exports.addVocabulary = async (req, res) => {
  try {
    const { imageFile, ...vocabularyData } = req.body;

    if (imageFile) {
      // Upload the new image to Cloudinary
      const result = await cloudinary.uploader.upload(imageFile, {
        folder: "vocabularyImages",
      });
      vocabularyData.imageUrl = result.url;
      vocabularyData.imagePublicId = result.public_id;
    }

    const newVocabulary = new Vocabulary(vocabularyData);
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

// Update a vocabulary by ID, including image handling
exports.updateVocabulary = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageFile, ...updates } = req.body;

    const vocabulary = await Vocabulary.findById(id);
    if (!vocabulary) {
      return res
        .status(404)
        .json({ success: false, error: { message: "Vocabulary not found." } });
    }

    // Handle image upload if new image data is provided
    if (imageFile) {
      // Check and possibly delete the old image if it exists
      if (vocabulary.imagePublicId) {
        await cloudinary.uploader.destroy(vocabulary.imagePublicId);
      }

      // Upload the new image to Cloudinary
      const result = await cloudinary.uploader.upload(imageFile, {
        folder: "vocabularyImages",
      });
      updates.imageUrl = result.url;
      updates.imagePublicId = result.public_id;
    }

    const updatedVocabulary = await Vocabulary.findByIdAndUpdate(id, updates, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedVocabulary });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: error.message } });
  }
};

// Delete a vocabulary by ID, including image deletion
exports.deleteVocabulary = async (req, res) => {
  try {
    const { id } = req.params;

    const vocabulary = await Vocabulary.findById(id);
    if (!vocabulary) {
      return res
        .status(404)
        .json({ success: false, error: { message: "Vocabulary not found." } });
    }

    // If vocabulary has an image, delete it from Cloudinary
    if (vocabulary.imagePublicId) {
      await cloudinary.uploader.destroy(vocabulary.imagePublicId);
    }

    await Vocabulary.findByIdAndDelete(id);
    await Lesson.updateMany({}, { $pull: { vocabularies: id } }); // Remove references from lessons

    res.status(200).json({
      success: true,
      data: {
        message: "Vocabulary and associated image successfully deleted.",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};
