require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRouter.js");

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust to match the origin of your frontend
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

// Use userRouter
app.use("/api", userRouter);

module.exports = app;
