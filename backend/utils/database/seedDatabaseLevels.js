const mongoose = require("mongoose");
const Level = require("../../models/level.model");
const Lesson = require("../../models/lesson.model");

const seedDatabaseLevels = async () => {
  try {
    const totalLevels = 5;
    const lessonsPerLevel = 25;
    const levelsCount = await Level.countDocuments();

    if (levelsCount < totalLevels) {
      console.log("Seeding levels...");
      const allLessons = await Lesson.find().exec();

      for (let i = 0; i < totalLevels; i++) {
        const startLessonIndex = i * lessonsPerLevel;
        const levelLessons = allLessons.slice(
          startLessonIndex,
          startLessonIndex + lessonsPerLevel
        );

        const level = new Level({
          name: `Level ${i + 1}`,
          lessons: levelLessons.map((lesson) => lesson._id),
        });

        await level.save();
        console.log(
          `Level ${i + 1} seeded successfully with ${
            levelLessons.length
          } lessons.`
        );
      }
      console.log("All levels seeded successfully.");
    } else {
      console.log("5 levels already exist, not seeding more.");
    }
  } catch (error) {
    console.error("Error seeding levels:", error);
  }
};

module.exports = seedDatabaseLevels;
