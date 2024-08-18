const mongoose = require("mongoose");
const Kanji = require("../../models/kanji.model");
const fs = require("fs");
const path = require("path");

const seedDatabaseKanji = async () => {
  try {
    const count = await Kanji.countDocuments();
    if (count === 0) {
      console.log("No kanjis found, loading data from JSON...");
      const dataPath = path.join(__dirname, "./data/initialKanjis.json");
      const initialKanjis = JSON.parse(fs.readFileSync(dataPath, "utf8"));
      await Kanji.insertMany(initialKanjis);
      console.log("Kanjis seeded successfully.");
    } else {
      console.log("Kanjis already exist, not seeding.");
    }
  } catch (error) {
    console.error("Error seeding kanjis:", error);
  }
};

module.exports = seedDatabaseKanji;
