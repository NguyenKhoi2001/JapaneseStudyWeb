const mongoose = require("mongoose");
const Level = require("../../models/level.model");
const Lesson = require("../../models/lesson.model");

const seedDatabaseLevels = async () => {
  try {
    const levelsCount = await Level.countDocuments();
    if (levelsCount === 0) {
      console.log("No levels found, seeding levels...");
      const totalLevels = 5;
      const lessonsPerLevel = 25;
      const allLessons = await Lesson.find().exec();

      if (allLessons.length < lessonsPerLevel * 2) {
        console.log("Not enough lessons to populate the first two levels.");
        return;
      }

      for (let i = 0; i < totalLevels; i++) {
        let levelLessons = [];

        if (i < 2) {
          // Populate only the first two levels with lessons
          const startLessonIndex = i * lessonsPerLevel;
          if (startLessonIndex >= allLessons.length) {
            console.log(
              `Not enough lessons available for Level ${
                i + 1
              }. Skipping this level.`
            );
            continue;
          }
          levelLessons = allLessons.slice(
            startLessonIndex,
            Math.min(startLessonIndex + lessonsPerLevel, allLessons.length)
          );
        }

        if (levelLessons.length > 0) {
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
        } else {
          console.log(`No lessons available for Level ${i + 1}. Skipping.`);
        }
      }
      console.log("All applicable levels seeded successfully.");
    } else {
      console.log("Levels already exist, not seeding.");
    }
  } catch (error) {
    console.error("Error seeding levels:", error);
  }
};

module.exports = seedDatabaseLevels;
