const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../../models/user.model");

// Seed initial admin and teacher users
const seedInitialUsers = async () => {
  try {
    const adminCount = await User.countDocuments({ roles: "admin" });
    const teacherCount = await User.countDocuments({ roles: "teacher" });

    if (adminCount === 0) {
      console.log("No admin found, creating an admin...");
      const adminPassword = "Admin123!";
      const hashedAdminPassword = await bcrypt.hash(adminPassword, 12); // Hashing the admin password
      await User.create({
        username: "admin",
        email: "admin@example.com",
        passwordHash: hashedAdminPassword,
        roles: ["admin"],
        displayName: "Admin User",
      });
      console.log("Admin user created successfully.");
    }

    if (teacherCount < 2) {
      console.log(`Found ${teacherCount} teachers, creating more...`);
      const teacherPassword = "Teacher123!";
      for (let i = teacherCount; i < 2; i++) {
        const hashedTeacherPassword = await bcrypt.hash(teacherPassword, 12); // Hashing the teacher password
        await User.create({
          username: `teacher${i + 1}`,
          email: `teacher${i + 1}@example.com`,
          passwordHash: hashedTeacherPassword,
          roles: ["teacher"],
          displayName: `Teacher ${i + 1}`,
        });
      }
      console.log("Teacher users created successfully.");
    }
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};

module.exports = seedInitialUsers;
