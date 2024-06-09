const request = require("supertest");
const app = require("../../app");
const {
  connectTestDatabase,
  closeTestDatabase,
} = require("../../test/testDatabase");

describe("Level API Tests", () => {
  let userToken, teacherToken, adminToken;
  let vocabularyId,
    kanjiId,
    grammarId,
    questionId,
    lessonId,
    levelId,
    adminLevelId;

  beforeAll(async () => {
    await closeTestDatabase();
    await connectTestDatabase();
    await setupUsers();
    await setupPrerequisites();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  async function setupUsers() {
    // Create an admin user first
    let res = await request(app)
      .post("/api/users")
      .send({
        username: "adminuserforvocab",
        email: "adminuserforvocab@example.com",
        password: "AdminPassword123!",
        displayName: "Admin User",
        roles: ["user", "teacher", "admin"],
      });
    adminToken = res.body.data.token;

    // Use the admin token to create a teacher user
    res = await request(app)
      .post("/api/users/teacher") // Assuming this is the correct endpoint for creating a teacher
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        username: "teacheruserforvocab",
        email: "teacherforvocab@example.com",
        password: "TeacherPassword123!",
        displayName: "Teacher User",
        roles: ["user", "teacher"],
      });
    teacherToken = res.body.data.token;

    // Create a new regular user without admin privileges
    res = await request(app)
      .post("/api/users")
      .send({
        username: "testuserforvocab",
        email: "testuserforvocab@example.com",
        password: "Password123!",
        displayName: "Test User",
        roles: ["user"],
      });
    userToken = res.body.data.token;
  }

  async function setupPrerequisites() {
    // Vocabulary creation
    let res = await request(app)
      .post("/api/vocabulary/")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        hiraganaKatakana: "せんせい",
        meanings: { en: ["Teacher"], vi: ["Giáo viên"] },
        examples: [
          {
            sentence: "このせんせいはとてもやさしいです。",
            meaning: {
              en: "This teacher is very kind.",
              vi: "Giáo viên này rất tử tế.",
            },
          },
        ],
        imageUrl: "http://example.com/image.jpg",
        sinoVietnameseSounds: "Sensei",
      });
    expect(res.statusCode).toEqual(201);
    vocabularyId = res.body.data._id;

    // Kanji creation
    res = await request(app)
      .post("/api/kanji/")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        character: "火",
        meaning: {
          jp: "火",
          en: "fire",
          vi: "lửa",
        },
        sinoVietnameseSounds: "hoả",
        onyomi: ["カ"],
        kunyomi: ["ひ", "-び", "ほ-"],
        examples: [
          {
            kanjiWord: "火曜日",
            hiragana: "かようび",
            meaning: {
              en: "Tuesday",
              vi: "Thứ ba",
            },
          },
        ],
      });
    expect(res.statusCode).toEqual(201);
    kanjiId = res.body.data._id;

    // Grammar creation
    res = await request(app)
      .post("/api/grammar/")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        vi: {
          title: "Nâng cao Ngữ pháp Điểm",
          htmlContent:
            "<p>Đây là giải thích về một điểm ngữ pháp nâng cao bằng tiếng Việt.</p>",
        },
        en: {
          title: "Advanced Grammar Point",
          htmlContent:
            "<p>This is an explanation of an advanced grammar point in English.</p>",
        },
      });
    expect(res.statusCode).toEqual(201);
    grammarId = res.body.data._id;

    // Question creation
    res = await request(app)
      .post("/api/questions")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        text: "What is the boiling point of water?",
        answers: ["100°C", "90°C", "120°C", "80°C"],
        correctAnswer: 0,
        difficulty: "Easy",
      });
    expect(res.statusCode).toEqual(201);
    questionId = res.body.data._id;

    res = await request(app)
      .post("/api/lessons")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        title: "Teacher Created Lesson",
        vocabularies: [vocabularyId],
        kanjis: [kanjiId],
        grammars: [grammarId],
        questions: [questionId],
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toBeDefined();
    lessonId = res.body.data._id;
  }

  describe("Level Creation Tests", () => {
    it("should forbid user from creating a level", async () => {
      const res = await request(app)
        .post("/api/levels")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ name: "Beginner", lessons: [lessonId] });
      expect(res.statusCode).toEqual(403);
      expect(res.body.error.message).toEqual(
        "Forbidden: Insufficient privileges"
      );
    });

    it("should allow teacher to create a level", async () => {
      const res = await request(app)
        .post("/api/levels")
        .set("Authorization", `Bearer ${teacherToken}`)
        .send({ name: "Intermediate", lessons: [lessonId] });
      expect(res.statusCode).toEqual(201);
      expect(res.body.data).toBeDefined();
      levelId = res.body.data._id; // Save for further operations
    });

    it("should allow admin to create a level", async () => {
      const res = await request(app)
        .post("/api/levels")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Advanced", lessons: [lessonId] });
      expect(res.statusCode).toEqual(201);
      expect(res.body.data).toBeDefined();
      adminLevelId = res.body.data._id; // Save for further operations
    });
  });

  describe("Public Access to Levels", () => {
    it("should allow access to all levels without authentication", async () => {
      const res = await request(app).get("/api/levels");
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data)).toBe(true); // Corrected to check res.body.data instead of res.body
    });

    it("should allow access to a specific level by ID without authentication", async () => {
      const res = await request(app).get(`/api/levels/${levelId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty("name"); // Corrected to check res.body.data instead of res.body
    });
  });

  describe("Public Access to Levels", () => {
    it("should allow public access to all levels without authentication", async () => {
      const res = await request(app).get("/api/levels");
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should allow public access to a specific level by ID without authentication", async () => {
      const res = await request(app).get(`/api/levels/${levelId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty("name");
    });
  });

  describe("Level Update Tests", () => {
    it("should forbid a user from updating a level", async () => {
      const res = await request(app)
        .put(`/api/levels/${levelId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ name: "Updated Level Title by User" });
      expect(res.statusCode).toEqual(403);
    });

    it("should allow a teacher to update a level", async () => {
      const res = await request(app)
        .put(`/api/levels/${levelId}`)
        .set("Authorization", `Bearer ${teacherToken}`)
        .send({ name: "Updated Level Title by Teacher" });
      expect(res.statusCode).toEqual(200);
    });

    it("should allow an admin to update a level", async () => {
      const res = await request(app)
        .put(`/api/levels/${levelId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Updated Level Title by Admin" });
      expect(res.statusCode).toEqual(200);
    });
  });

  describe("Level Deletion Tests", () => {
    it("should forbid a user from deleting a level", async () => {
      const res = await request(app)
        .delete(`/api/levels/${levelId}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(403);
    });

    it("should allow a teacher to delete a level", async () => {
      const res = await request(app)
        .delete(`/api/levels/${adminLevelId}`)
        .set("Authorization", `Bearer ${teacherToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true); // Verifying that the operation was successful
      expect(res.body.data).toHaveProperty(
        "message",
        "Level successfully deleted"
      );
    });

    it("should allow an admin to delete a level", async () => {
      const res = await request(app)
        .delete(`/api/levels/${levelId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true); // Verifying that the operation was successful
      expect(res.body.data).toHaveProperty(
        "message",
        "Level successfully deleted"
      );
    });
  });
});
