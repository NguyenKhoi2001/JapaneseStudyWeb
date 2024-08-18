const mongoose = require("mongoose");
const Question = require("../../models/question.model");
const fs = require("fs");
const path = require("path");

const seedDatabaseQuestions = async () => {
  try {
    const count = await Question.countDocuments();
    if (count === 0) {
      console.log("No questions found, loading data from JSON...");
      const dataPath = path.join(__dirname, "./data/initialQuestions.json");
      const initialQuestions = JSON.parse(fs.readFileSync(dataPath, "utf8"));
      await Question.insertMany(initialQuestions);
      console.log("Questions seeded successfully.");
    } else {
      console.log("Questions already exist, not seeding.");
    }
  } catch (error) {
    console.error("Error seeding questions:", error);
  }
};

module.exports = seedDatabaseQuestions;
