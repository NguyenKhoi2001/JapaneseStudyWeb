const request = require("supertest");
const app = require("../../app"); // Adjust the path according to your project structure
const {
  connectTestDatabase,
  closeTestDatabase,
} = require("../../test/testDatabase"); // Adjust the path according to your project structure

describe("Vocabulary API Tests", () => {
  let userToken, teacherToken, adminToken;
  let teacherVocabId, adminVocabId;

  beforeAll(async () => {
    await closeTestDatabase();
    await connectTestDatabase();
    await setupUsers();
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

  describe("Create Vocabulary", () => {
    it("should forbid vocabulary creation by a normal user", async () => {
      const res = await request(app)
        .post("/api/vocabulary/")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          hiraganaKatakana: "ひらがな",
          meanings: { en: ["Hiragana"], vi: ["Chữ Hiragana"] },
          examples: [
            {
              sentence: "Example usage of hiragana",
              meaning: {
                en: "English meaning of the example",
                vi: "Vietnamese meaning of the example",
              },
            },
          ],
        });
      expect(res.statusCode).toEqual(403);
    });

    it("should allow a teacher to create vocabulary", async () => {
      const res = await request(app)
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
      teacherVocabId = res.body.data._id;
    });

    it("should allow an admin to create vocabulary", async () => {
      const res = await request(app)
        .post("/api/vocabulary/")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          hiraganaKatakana: "がっこう",
          meanings: { en: ["School"], vi: ["Trường học"] },
          examples: [
            {
              sentence: "がっこうへいきます。",
              meaning: {
                en: "I'm going to school.",
                vi: "Tôi đang đi đến trường.",
              },
            },
          ],
          imageUrl: "http://example.com/school.jpg",
          sinoVietnameseSounds: "Gakkou",
        });
      expect(res.statusCode).toEqual(201);
      adminVocabId = res.body.data._id;
    });
  });

  describe("Access and Modify Vocabulary", () => {
    it("should allow fetching all vocabularies without authentication", async () => {
      const res = await request(app).get("/api/vocabulary/");
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it("should allow fetching a specific vocabulary without authentication", async () => {
      const res = await request(app).get(`/api/vocabulary/${teacherVocabId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty("hiraganaKatakana");
    });

    it("should forbid a normal user from updating vocabulary", async () => {
      const res = await request(app)
        .put(`/api/vocabulary/${teacherVocabId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ meanings: { en: ["Updated Meaning"] } });
      expect(res.statusCode).toEqual(403);
    });

    it("should allow a teacher to update vocabulary", async () => {
      const updatedVocabularyData = {
        hiraganaKatakana: "Updated せんせい",
        meanings: { en: ["Updated Teacher"], vi: ["Cập nhật Giáo viên"] },
        examples: [
          {
            sentence: "このせんせいはとてもやさしいです。Updated",
            meaning: {
              en: "This teacher is very kind. Updated",
              vi: "Giáo viên này rất tử tế. Cập nhật",
            },
          },
        ],
        imageUrl: "http://example.com/image-updated.jpg",
        sinoVietnameseSounds: "Updated Sensei",
      };

      const res = await request(app)
        .put(`/api/vocabulary/${teacherVocabId}`)
        .set("Authorization", `Bearer ${teacherToken}`)
        .send(updatedVocabularyData);

      expect(res.statusCode).toEqual(200);
    });

    it("should allow an admin to update vocabulary", async () => {
      const updatedVocabularyData = {
        hiraganaKatakana: "Updated がっこう",
        meanings: { en: ["Updated School"], vi: ["Trường học Cập nhật"] },
        examples: [
          {
            sentence: "がっこうへいきます。Updated",
            meaning: {
              en: "I'm going to school. Updated",
              vi: "Tôi đang đi đến trường. Cập nhật",
            },
          },
        ],
        imageUrl: "http://example.com/school-updated.jpg",
        sinoVietnameseSounds: "Updated Gakkou",
      };

      const res = await request(app)
        .put(`/api/vocabulary/${adminVocabId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updatedVocabularyData);

      expect(res.statusCode).toEqual(200);
    });
  });

  describe("Delete Vocabulary", () => {
    it("should forbid a normal user from deleting vocabulary", async () => {
      const res = await request(app)
        .delete(`/api/vocabulary/${teacherVocabId}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(403);
    });

    it("should allow a teacher to delete vocabulary", async () => {
      const res = await request(app)
        .delete(`/api/vocabulary/${teacherVocabId}`)
        .set("Authorization", `Bearer ${teacherToken}`);
      expect(res.statusCode).toEqual(200);
    });

    it("should allow an admin to delete vocabulary", async () => {
      const res = await request(app)
        .delete(`/api/vocabulary/${adminVocabId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
    });
  });
});
