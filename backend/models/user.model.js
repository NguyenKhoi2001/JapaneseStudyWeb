const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  displayName: String,
  profilePicture: String,
  profilePicturePublicId: { type: String, default: "" },
  dateJoined: { type: Date, default: Date.now },
  lastLogin: Date,
  progress: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserProgress" }],
  preferences: {
    language: { type: String, default: "vn" },
    notificationSettings: {
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: false },
    },
  },
  roles: [{ type: String }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
