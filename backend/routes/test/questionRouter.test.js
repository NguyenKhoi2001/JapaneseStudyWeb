const request = require("supertest");
const app = require("../../app");
const {
  connectTestDatabase,
  closeTestDatabase,
} = require("../../test/testDatabase");

describe("question API Tests", () => {
  beforeAll(async () => {
    await connectTestDatabase();
    await setupUsers();
    await setupLessonsAndQuestions();
  });
  afterAll(async () => {
    await closeTestDatabase();
  });

  let userToken, teacherToken, adminToken;
  let teacherQuestionId, adminQuestionId;
  let levelId;
  let lessonId;
  let lessonIds = [];
  let questions = [];

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

  async function setupLessonsAndQuestions() {
    // Create 3 lessons
    for (let i = 1; i <= 3; i++) {
      let lessonRes = await request(app)
        .post("/api/lessons")
        .set("Authorization", `Bearer ${teacherToken}`)
        .send({
          title: {
            jp: `レッスン ${i}`,
            en: `Lesson ${i}`,
            vi: `Bài học ${i}`,
          },
          vocabularies: [],
          kanjis: [],
          grammars: [],
          questions: [],
        });

      lessonId = lessonRes.body.data._id;
      lessonIds.push(lessonId);

      // Create questions for each lesson. Distribute 10 questions among 3 lessons.
      const questionsPerLesson = i === 3 ? 4 : 3; // Assign 4 questions to the last lesson to make a total of 10
      for (let q = 1; q <= questionsPerLesson; q++) {
        let questionText = `Question ${q} for Lesson ${i}`;
        let answers = ["Option A", "Option B", "Option C", "Option D"];
        let correctAnswer = q % 4; // Just to have some variety
        let difficulty = ["Easy", "Medium", "Hard"][q % 3];

        let questionRes = await request(app)
          .post("/api/questions")
          .set("Authorization", `Bearer ${teacherToken}`)
          .send({
            text: questionText,
            answers: answers,
            correctAnswer: correctAnswer,
            difficulty: difficulty,
            lessonId: lessonId,
          });

        questions.push(questionRes.body.data._id); // Store question IDs for potential use in tests
      }
    }
    await (async () => {
      const res = await request(app)
        .post("/api/levels/")
        .set("Authorization", `Bearer ${teacherToken}`)
        .send({ name: "Intermediate", lessons: lessonIds });
      expect(res.statusCode).toEqual(201);
      levelId = res.body.data._id; // Save the created level ID for later tests
    })();
  }

  describe("User Roles and Question Management", () => {
    describe("Creating Questions", () => {
      it("should forbid a normal user from creating a question", async () => {
        const res = await request(app)
          .post("/api/questions")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            text: "What is the capital of Spain?",
            answers: ["Madrid", "Barcelona", "Seville", "Valencia"],
            correctAnswer: 0,
            difficulty: "Easy",
          });
        expect(res.statusCode).toEqual(403);
        expect(res.body.error.message).toEqual(
          "Forbidden: Insufficient privileges"
        );
      });

      it("allows a teacher to create a question", async () => {
        const res = await request(app)
          .post("/api/questions")
          .set("Authorization", `Bearer ${teacherToken}`)
          .send({
            text: "What is the boiling point of water?",
            answers: ["100°C", "90°C", "120°C", "80°C"],
            correctAnswer: 0,
            difficulty: "Easy",
          });
        expect(res.statusCode).toEqual(201);
        expect(res.body.data).toBeDefined();
        teacherQuestionId = res.body.data._id;
      });

      it("allows an admin to create a question", async () => {
        const res = await request(app)
          .post("/api/questions")
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            text: "Who discovered penicillin?",
            answers: [
              "Alexander Fleming",
              "Marie Curie",
              "Isaac Newton",
              "Albert Einstein",
            ],
            correctAnswer: 0,
            difficulty: "Medium",
          });
        expect(res.statusCode).toEqual(201);
        expect(res.body.data).toBeDefined();
        adminQuestionId = res.body.data._id;
      });
    });

    describe("Fetching Questions", () => {
      it("allows public access to get a specific question created by a teacher", async () => {
        const res = await request(app).get(
          `/api/questions/${teacherQuestionId}`
        );
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveProperty("text"); // Ensure to check under `data`
      });

      it("allows public access to get all questions without authentication", async () => {
        const res = await request(app).get("/api/questions/");
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.data)).toBe(true); // Check under `data`
      });

      it("allows public access to get all questions from a specific lesson without authentication", async () => {
        const res = await request(app).get(
          `/api/questions/lesson-questions/${lessonId}`
        );
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.data)).toBe(true); // Check under `data`
      });

      it("allows public access to get all questions from a specific level without authentication", async () => {
        const res = await request(app).get(
          `/api/questions/level-questions/${levelId}`
        );
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.data)).toBe(true); // Check under `data`
      });
    });

    describe("Updating Questions", () => {
      it("should forbid a normal user from updating a question", async () => {
        const res = await request(app)
          .put(`/api/questions/${teacherQuestionId}`)
          .set("Authorization", `Bearer ${userToken}`)
          .send({ text: "Updated Question by User", difficulty: "Medium" });
        expect(res.statusCode).toEqual(403);
        expect(res.body.error.message).toEqual(
          "Forbidden: Insufficient privileges"
        );
      });

      it("allows a teacher to update a question created by an admin", async () => {
        const updatedText = "Updated Question by Teacher";
        const updatedDifficulty = "Hard";
        const res = await request(app)
          .put(`/api/questions/${adminQuestionId}`)
          .set("Authorization", `Bearer ${teacherToken}`)
          .send({
            text: updatedText,
            answers: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: 0,
            difficulty: updatedDifficulty,
          });
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.text).toEqual(updatedText);
        expect(res.body.data.difficulty).toEqual(updatedDifficulty);
      });

      it("allows an admin to update a question created by a teacher", async () => {
        const updatedText = "Updated Question by Admin";
        const updatedDifficulty = "Medium";
        const res = await request(app)
          .put(`/api/questions/${teacherQuestionId}`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            text: updatedText,
            answers: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: 0,
            difficulty: updatedDifficulty,
          });
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.text).toEqual(updatedText);
        expect(res.body.data.difficulty).toEqual(updatedDifficulty);
      });
    });

    describe("Deleting Questions", () => {
      it("should forbid a normal user from deleting a question", async () => {
        const res = await request(app)
          .delete(`/api/questions/${teacherQuestionId}`)
          .set("Authorization", `Bearer ${userToken}`);
        expect(res.statusCode).toEqual(403);
        expect(res.body.error.message).toEqual(
          "Forbidden: Insufficient privileges"
        );
      });

      it("allows a teacher to delete a question created by an admin", async () => {
        // First create a question to delete
        const createRes = await request(app)
          .post("/api/questions")
          .set("Authorization", `Bearer ${teacherToken}`)
          .send({
            text: "Question to Delete",
            answers: ["Yes", "No"],
            correctAnswer: 0,
            difficulty: "Easy",
          });
        const questionToDeleteId = createRes.body.data._id;

        const res = await request(app)
          .delete(`/api/questions/${questionToDeleteId}`)
          .set("Authorization", `Bearer ${teacherToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.message).toEqual(
          "Question successfully deleted and references removed from lessons."
        );
      });

      it("allows an admin to delete a question created by a teacher", async () => {
        // First create a question to delete
        const createRes = await request(app)
          .post("/api/questions")
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            text: "Admin's Question to Delete",
            answers: ["Yes", "No"],
            correctAnswer: 0,
            difficulty: "Easy",
          });
        const questionToDeleteId = createRes.body.data._id;

        const res = await request(app)
          .delete(`/api/questions/${questionToDeleteId}`)
          .set("Authorization", `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.message).toEqual(
          "Question successfully deleted and references removed from lessons."
        );
      });

      describe("Custom Fetch Questions", () => {
        it("should fetch custom questions from a specific lesson based on difficulty", async () => {
          const res = await request(app)
            .get(
              `/api/questions/custom-lesson-questions/${lessonIds[0]}?total=5&hard=1&medium=2&easy=2`
            )
            .set("Authorization", `Bearer ${teacherToken}`);
          expect(res.statusCode).toEqual(200);
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.data.length).toEqual(5);
        });

        it("should fetch custom questions from a specific level based on difficulty", async () => {
          const res = await request(app)
            .get(
              `/api/questions/custom-level-questions/${levelId}?total=5&hard=1&medium=2&easy=2`
            )
            .set("Authorization", `Bearer ${teacherToken}`);
          expect(res.statusCode).toEqual(200);
          expect(Array.isArray(res.body.data)).toBe(true);

          expect(res.body.data.length).toEqual(5);
        });
      });
    });
  });
});
