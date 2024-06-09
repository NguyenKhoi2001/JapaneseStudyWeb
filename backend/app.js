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

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust to match the origin of frontend
  })
);

// MongoDB connection
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected to MongoDB"))
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
