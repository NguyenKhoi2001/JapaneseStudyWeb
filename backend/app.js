require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Routers defined
const userRouter = require("./routes/userRouter.js");
const vocabularyRouter = require("./routes/vocabularyRouter.js");
const kanjiRouter = require("./routes/kanjiRouter.js");
const grammarRouter = require("./routes/grammarRouter.js");
const lessonRouter = require("./routes/lessonRouter.js");
const levelRouter = require("./routes/levelRouter.js");
const questionRouter = require("./routes/questionRouter.js");
const userProgressRouter = require("./routes/userProgressRouter.js");
const seedDatabaseVocabulary = require("./utils/database/seedDatabaseVocabulary.js");
const seedInitialUsers = require("./utils/database/seedInitialUsers.js");
const seedDatabaseKanji = require("./utils/database/seedDatabaseKanji.js");
const seedDatabaseGrammar = require("./utils/database/seedDatabaseGrammar.js");
const seedDatabaseLevels = require("./utils/database/seedDatabaseLevels.js");
const seedDatabaseLesson = require("./utils/database/seedDatabaseLessons.js");
const seedDatabaseQuestions = require("./utils/database/seedDatabaseQuestions.js");

const app = express();
app.use(express.json({ limit: "50mb" })); // Adjust limit as needed
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(
  cors({
    origin: "*", // Adjust to match the origin of frontend
  })
);

async function seedDatabase() {
  try {
    await seedInitialUsers();
    await seedDatabaseVocabulary();
    await seedDatabaseKanji();
    await seedDatabaseGrammar();
    await seedDatabaseQuestions();
    await seedDatabaseLesson();
    await seedDatabaseLevels();
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// MongoDB connection
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 900000, // 900 seconds
  })
  .then(() => {
    console.log("Connected to MongoDB");
    if (process.env.NODE_ENV !== "test") {
      // Only seed the database if not in test environment
      seedDatabase(); // Call the async function to seed the database
    }
  })
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Example route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Use routers
app.use("/api/users", userRouter);
app.use("/api/vocabulary", vocabularyRouter);
app.use("/api/kanji", kanjiRouter);
app.use("/api/grammar", grammarRouter);
app.use("/api/lessons", lessonRouter);
app.use("/api/levels", levelRouter);
app.use("/api/questions", questionRouter);
app.use("/api/userProgress", userProgressRouter);

module.exports = app;
