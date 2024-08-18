const request = require("supertest");
const app = require("../../app");
const {
  connectTestDatabase,
  closeTestDatabase,
} = require("../../test/testDatabase");

describe("Lesson API Tests", () => {
  let userToken, teacherToken, adminToken;
  let vocabularyId, kanjiId, grammarId, questionId, lessonId, adminLessonId;
  let newVocabularyId, newKanjiId, newGrammarId, newQuestionId;

  beforeAll(async () => {
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

    // New Vocabulary creation
    res = await request(app)
      .post("/api/vocabulary/")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        hiraganaKatakana: "新しい",
        meanings: { en: ["New"], vi: ["Mới"] },
        examples: [
          {
            sentence: "これは新しい本です。",
            meaning: {
              en: "This is a new book.",
              vi: "Đây là quyển sách mới.",
            },
          },
        ],
        imageUrl: "http://example.com/new.jpg",
        sinoVietnameseSounds: "Shin",
      });
    newVocabularyId = res.body.data._id;

    // New Kanji creation
    res = await request(app)
      .post("/api/kanji/")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        character: "新",
        meaning: { jp: "新", en: "New", vi: "Mới" },
        sinoVietnameseSounds: "Shin",
        onyomi: ["シン"],
        kunyomi: ["あたらしい", "にい"],
        examples: [
          {
            kanjiWord: "新年",
            hiragana: "しんねん",
            meaning: { en: "New Year", vi: "Năm mới" },
          },
        ],
      });
    newKanjiId = res.body.data._id;

    // New Grammar creation
    res = await request(app)
      .post("/api/grammar/")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        vi: {
          title: "Cấu trúc mới",
          htmlContent: "<p>Giải thích về cấu trúc ngữ pháp mới.</p>",
        },
        en: {
          title: "New Grammar Structure",
          htmlContent: "<p>Explanation about a new grammar structure.</p>",
        },
      });
    newGrammarId = res.body.data._id;

    // New Question creation
    res = await request(app)
      .post("/api/questions")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        text: "What is the capital of Japan?",
        answers: ["Tokyo", "Kyoto", "Osaka", "Nagoya"],
        correctAnswer: 0,
        difficulty: "Easy",
      });
    newQuestionId = res.body.data._id;
  }
  describe("Lesson Creation", () => {
    // Test: Create lesson by user (should be forbidden)
    it("should forbid a normal user from creating a lesson", async () => {
      const res = await request(app)
        .post("/api/lessons")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          title: {
            jp: "ユーザー作成レッスン", // Japanese title
            en: "User Created Lesson", // English title
            vi: "Bài học do người dùng tạo", // Vietnamese title (required)
          },
          vocabularies: [vocabularyId],
          kanjis: [kanjiId],
          grammars: [grammarId],
          questions: [questionId],
        });
      expect(res.statusCode).toEqual(403);
      expect(res.body.error.message).toEqual(
        "Forbidden: Insufficient privileges"
      );
    });

    // Test: Create lesson by teacher
    it("should allow a teacher to create a lesson", async () => {
      const res = await request(app)
        .post("/api/lessons")
        .set("Authorization", `Bearer ${teacherToken}`)
        .send({
          title: {
            jp: "先生が作成したレッスン",
            en: "Teacher Created Lesson",
            vi: "Bài học do giáo viên tạo",
          },

          vocabularies: [vocabularyId],
          kanjis: [kanjiId],
          grammars: [grammarId],
          questions: [questionId],
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.data).toBeDefined();
      lessonId = res.body.data._id; // Save for further operations
    });

    // Test: Create lesson by admin
    it("should allow an admin to create a lesson", async () => {
      const res = await request(app)
        .post("/api/lessons")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: {
            jp: "管理者が作成したレッスン",
            en: "Admin Created Lesson",
            vi: "Bài học do quản trị viên tạo",
          },
          vocabularies: [vocabularyId],
          kanjis: [kanjiId],
          grammars: [grammarId],
          questions: [questionId],
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.data).toBeDefined();
      adminLessonId = res.body.data._id; // Save for further operations
    });
  });

  describe("Public Lesson Access", () => {
    // Test: Get a specific lesson (public access)
    it("should allow public access to a specific lesson by ID", async () => {
      const res = await request(app).get(`/api/lessons/${lessonId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.title).toBeDefined();
    });

    // Test: Get all lessons (public access)
    it("should allow public access to all lessons", async () => {
      const res = await request(app).get("/api/lessons");
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    // Test: Get learning resources by lesson ID (public access)
    it("should allow public access to learning resources by lesson ID", async () => {
      const res = await request(app).get(
        `/api/lessons/resourceByLesson/${lessonId}`
      );
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty("vocabularies");
      expect(res.body.data).toHaveProperty("kanjis");
      expect(res.body.data).toHaveProperty("grammars");
      expect(res.body.data).toHaveProperty("questions");
    });
  });

  describe("Lesson Update", () => {
    // Test: Update lesson by user (should be forbidden)
    it("should forbid a normal user from updating a lesson", async () => {
      const res = await request(app)
        .put(`/api/lessons/${lessonId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          title: {
            jp: "ユーザーによる不正な更新試行",
            en: "Unauthorized Update Attempt by User",
            vi: "Nỗ lực cập nhật không được phép bởi người dùng",
          },
        });
      expect(res.statusCode).toEqual(403);
    });

    // Test: Update lesson by teacher
    it("should allow a teacher to update a lesson", async () => {
      const res = await request(app)
        .put(`/api/lessons/${lessonId}`)
        .set("Authorization", `Bearer ${teacherToken}`)
        .send({
          title: {
            jp: "教師による更新されたレッスンタイトル",
            en: "Updated Lesson Title by Teacher",
            vi: "Tiêu đề bài học được cập nhật bởi giáo viên",
          },
        });
      expect(res.statusCode).toEqual(200);
    });

    // Test: Update lesson by admin
    it("should allow an admin to update a lesson", async () => {
      const res = await request(app)
        .put(`/api/lessons/${adminLessonId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: {
            jp: "管理者による更新されたレッスンタイトル",
            en: "Updated Lesson Title by Admin",
            vi: "Tiêu đề bài học được cập nhật bởi quản trị viên",
          },
        });
      expect(res.statusCode).toEqual(200);
    });
  });

  describe("Lesson Modification - Adding and Removing Items", () => {
    it("allows a teacher to add new items to a lesson", async () => {
      const addResponse = await request(app)
        .put(`/api/lessons/${lessonId}/modifyItems`)
        .set("Authorization", `Bearer ${teacherToken}`)
        .send({
          add: {
            vocabularies: [newVocabularyId],
            kanjis: [newKanjiId],
            grammars: [newGrammarId],
            questions: [newQuestionId],
          },
        });
      expect(addResponse.statusCode).toEqual(200);
      expect(addResponse.body.success).toBeTruthy();

      const lessonAfterAdd = await request(app).get(`/api/lessons/${lessonId}`);
      expect(
        lessonAfterAdd.body.data.vocabularies.some(
          (v) => v._id === newVocabularyId
        )
      ).toBeTruthy();
      expect(
        lessonAfterAdd.body.data.kanjis.some((k) => k._id === newKanjiId)
      ).toBeTruthy();
      expect(
        lessonAfterAdd.body.data.grammars.some((g) => g._id === newGrammarId)
      ).toBeTruthy();
      expect(
        lessonAfterAdd.body.data.questions.includes(newQuestionId)
      ).toBeTruthy();
    });

    it("allows a teacher to remove items from a lesson", async () => {
      const removeResponse = await request(app)
        .put(`/api/lessons/${lessonId}/modifyItems`)
        .set("Authorization", `Bearer ${teacherToken}`)
        .send({
          remove: {
            vocabularies: [newVocabularyId],
            kanjis: [newKanjiId],
            grammars: [newGrammarId],
            questions: [newQuestionId],
          },
        });
      expect(removeResponse.statusCode).toEqual(200);
      expect(removeResponse.body.success).toBeTruthy();

      const lessonAfterRemove = await request(app).get(
        `/api/lessons/${lessonId}`
      );
      expect(
        lessonAfterRemove.body.data.vocabularies.every(
          (v) => v._id !== newVocabularyId
        )
      ).toBeTruthy();
      expect(
        lessonAfterRemove.body.data.kanjis.every((k) => k._id !== newKanjiId)
      ).toBeTruthy();
      expect(
        lessonAfterRemove.body.data.grammars.every(
          (g) => g._id !== newGrammarId
        )
      ).toBeTruthy();
      expect(
        !lessonAfterRemove.body.data.questions.includes(newQuestionId)
      ).toBeTruthy();
    });

    it("forbids a normal user from modifying items in a lesson", async () => {
      const addResponse = await request(app)
        .put(`/api/lessons/${lessonId}/modifyItems`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          add: { vocabularies: [newVocabularyId] },
        });
      expect(addResponse.statusCode).toEqual(403);
      expect(addResponse.body.success).toBeFalsy();

      const removeResponse = await request(app)
        .put(`/api/lessons/${lessonId}/modifyItems`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          remove: { vocabularies: [vocabularyId] },
        });
      expect(removeResponse.statusCode).toEqual(403);
      expect(removeResponse.body.success).toBeFalsy();
    });

    it("allows an admin to add new items to a lesson", async () => {
      const addResponse = await request(app)
        .put(`/api/lessons/${lessonId}/modifyItems`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          add: {
            vocabularies: [newVocabularyId],
            kanjis: [newKanjiId],
            grammars: [newGrammarId],
            questions: [newQuestionId],
          },
        });
      expect(addResponse.statusCode).toEqual(200);
      expect(addResponse.body.success).toBeTruthy();

      const lessonAfterAdd = await request(app).get(`/api/lessons/${lessonId}`);
      expect(
        lessonAfterAdd.body.data.vocabularies.some(
          (v) => v._id === newVocabularyId
        )
      ).toBeTruthy();
      expect(
        lessonAfterAdd.body.data.kanjis.some((k) => k._id === newKanjiId)
      ).toBeTruthy();
      expect(
        lessonAfterAdd.body.data.grammars.some((g) => g._id === newGrammarId)
      ).toBeTruthy();
      expect(
        lessonAfterAdd.body.data.questions.includes(newQuestionId)
      ).toBeTruthy();
    });

    it("allows an admin to remove items from a lesson", async () => {
      // First, ensure the items are present by adding them.
      await request(app)
        .put(`/api/lessons/${lessonId}/modifyItems`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          add: {
            vocabularies: [newVocabularyId],
            kanjis: [newKanjiId],
            grammars: [newGrammarId],
            questions: [newQuestionId],
          },
        });

      // Then, perform the removal.
      const removeResponse = await request(app)
        .put(`/api/lessons/${lessonId}/modifyItems`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          remove: {
            vocabularies: [newVocabularyId],
            kanjis: [newKanjiId],
            grammars: [newGrammarId],
            questions: [newQuestionId],
          },
        });
      expect(removeResponse.statusCode).toEqual(200);
      expect(removeResponse.body.success).toBeTruthy();

      const lessonAfterRemove = await request(app).get(
        `/api/lessons/${lessonId}`
      );
      expect(
        lessonAfterRemove.body.data.vocabularies.every(
          (v) => v._id !== newVocabularyId
        )
      ).toBeTruthy();
      expect(
        lessonAfterRemove.body.data.kanjis.every((k) => k._id !== newKanjiId)
      ).toBeTruthy();
      expect(
        lessonAfterRemove.body.data.grammars.every(
          (g) => g._id !== newGrammarId
        )
      ).toBeTruthy();
      expect(
        !lessonAfterRemove.body.data.questions.includes(newQuestionId)
      ).toBeTruthy();
    });
  });

  describe("Lesson Deletion", () => {
    // Test: Delete lesson by user (should be forbidden)
    it("should forbid a normal user from deleting a lesson", async () => {
      const res = await request(app)
        .delete(`/api/lessons/${lessonId}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(403);
      expect(res.body.error.message).toEqual(
        "Forbidden: Insufficient privileges"
      );
    });

    // Test: Delete lesson by teacher
    it("should allow a teacher to delete a lesson", async () => {
      // Assuming we create another lesson for deletion to not affect other tests
      let creationRes = await request(app)
        .post("/api/lessons")
        .set("Authorization", `Bearer ${teacherToken}`)
        .send({
          title: {
            en: "Lesson for Deletion by Teacher",
            vi: "Bài học để xóa bởi giáo viên",
            jp: "教師による削除用レッスン",
          },

          vocabularies: [vocabularyId],
          kanjis: [kanjiId],
          grammars: [grammarId],
          questions: [questionId],
        });
      expect(creationRes.statusCode).toEqual(201);
      let deleteLessonId = creationRes.body.data._id;

      const res = await request(app)
        .delete(`/api/lessons/${deleteLessonId}`)
        .set("Authorization", `Bearer ${teacherToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.message).toEqual(
        "Lesson successfully deleted and references removed."
      );
    });

    // Test: Delete lesson by admin
    it("should allow an admin to delete a lesson", async () => {
      const res = await request(app)
        .delete(`/api/lessons/${adminLessonId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.message).toEqual(
        "Lesson successfully deleted and references removed."
      );
    });
  });
});
