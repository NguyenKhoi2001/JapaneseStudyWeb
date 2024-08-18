const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Grammar = require("../../models/grammar.model");

const seedDatabaseGrammar = async () => {
  try {
    const count = await Grammar.countDocuments();
    if (count === 0) {
      console.log("No grammar entries found, loading data from JSON...");
      const dataPath = path.join(__dirname, "./data/initialGrammars.json"); // Adjust the path as necessary
      const initialGrammars = JSON.parse(fs.readFileSync(dataPath, "utf8"));
      await Grammar.insertMany(initialGrammars);
      console.log("Grammar entries seeded successfully.");
    } else {
      console.log("Grammar entries already exist, not seeding.");
    }
  } catch (error) {
    console.error("Error seeding grammars:", error);
  }
};

module.exports = seedDatabaseGrammar;
