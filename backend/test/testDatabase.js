// testDatabase.js
const mongoose = require("mongoose");

const testDatabaseURI = "mongodb://127.0.0.1/japaneseTest";

const connectTestDatabase = async () => {
  await mongoose.connect(testDatabaseURI, {});
  console.log("Connected to the test database.");
};

const closeTestDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  console.log("Test database connection closed and data cleared.");
};

module.exports = { connectTestDatabase, closeTestDatabase };
