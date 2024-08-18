const mongoose = require("mongoose");
const Vocabulary = require("../../models/vocabulary.model");
const fs = require("fs");
const path = require("path");

const seedDatabaseVocabulary = async () => {
  try {
    const count = await Vocabulary.countDocuments();
    if (count === 0) {
      console.log("No vocabularies found, loading data from JSON...");
      const dataPath = path.join(__dirname, "./data/initialVocabularies.json");
      const initialVocabularies = JSON.parse(fs.readFileSync(dataPath, "utf8"));
      await Vocabulary.insertMany(initialVocabularies);
      console.log("Vocabularies seeded successfully.");
    } else {
      console.log("Vocabularies already exist, not seeding.");
    }
  } catch (error) {
    console.error("Error seeding vocabularies:", error);
  }
};

module.exports = seedDatabaseVocabulary;
