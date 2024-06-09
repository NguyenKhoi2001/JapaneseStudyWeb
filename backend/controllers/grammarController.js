const Grammar = require("../models/grammar.model");
const Lesson = require("../models/lesson.model");

// Add a new grammar entry
exports.addGrammar = async (req, res) => {
  try {
    const newGrammar = new Grammar(req.body);
    const savedGrammar = await newGrammar.save();
    res.status(201).json({ success: true, data: savedGrammar });
  } catch (error) {
    console.error("Error creating grammar: ", error);
    res.status(400).json({
      success: false,
      error: { message: "Failed to create grammar", details: error.message },
    });
  }
};

// Get all grammar entries
exports.getAllGrammars = async (req, res) => {
  try {
    const grammars = await Grammar.find();
    res.status(200).json({ success: true, data: grammars });
  } catch (error) {
    console.error("Error fetching grammars: ", error);
    res.status(500).json({
      success: false,
      error: { message: "Failed to fetch grammars", details: error.message },
    });
  }
};

// Get a single grammar entry by ID
exports.getGrammarById = async (req, res) => {
  try {
    const grammar = await Grammar.findById(req.params.id);
    if (grammar) {
      res.status(200).json({ success: true, data: grammar });
    } else {
      res
        .status(404)
        .json({ success: false, error: { message: "Grammar not found" } });
    }
  } catch (error) {
    console.error("Error fetching grammar by ID: ", error);
    res.status(500).json({
      success: false,
      error: { message: "Failed to fetch grammar", details: error.message },
    });
  }
};

// Update a grammar entry by ID
exports.updateGrammar = async (req, res) => {
  try {
    const updatedGrammar = await Grammar.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updatedGrammar) {
      res.status(200).json({ success: true, data: updatedGrammar });
    } else {
      res
        .status(404)
        .json({ success: false, error: { message: "Grammar not found" } });
    }
  } catch (error) {
    console.error("Error updating grammar: ", error);
    res.status(400).json({
      success: false,
      error: { message: "Failed to update grammar", details: error.message },
    });
  }
};

// Delete a grammar entry by ID and remove references from lessons
exports.deleteGrammar = async (req, res) => {
  try {
    const grammarId = req.params.id;
    const grammar = await Grammar.findById(grammarId);
    if (!grammar) {
      return res
        .status(404)
        .json({ success: false, error: { message: "Grammar not found." } });
    }

    await Grammar.findByIdAndDelete(grammarId);

    // Now, remove the deleted grammar's ID from all lessons' grammars array
    await Lesson.updateMany({}, { $pull: { grammars: grammarId } });

    res.status(200).json({
      success: true,
      data: {
        message:
          "Grammar successfully deleted and references removed from lessons.",
      },
    });
  } catch (error) {
    console.error("Error deleting grammar: ", error);
    res.status(500).json({
      success: false,
      error: { message: "Failed to delete grammar", details: error.message },
    });
  }
};
