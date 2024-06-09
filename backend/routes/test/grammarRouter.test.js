const request = require("supertest");
const app = require("../../app");
const {
  connectTestDatabase,
  closeTestDatabase,
} = require("../../test/testDatabase");

describe("Grammar API Tests", () => {
  let userToken, teacherToken, adminToken;
  let grammarIdForTeacher, grammarIdForAdmin;

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

  describe("Create Grammar Entries", () => {
    it("User role should not be allowed to create grammar (Forbidden)", async () => {
      const res = await request(app)
        .post("/api/grammar/")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          vi: {
            title: "Cơ bản Ngữ pháp Điểm",
            htmlContent:
              "<p>Đây là giải thích của một điểm ngữ pháp cơ bản bằng tiếng Việt.</p>",
          },
        });
      expect(res.statusCode).toEqual(403);
    });

    it("Teacher role should create grammar with only Vietnamese content", async () => {
      const grammarData = {
        vi: {
          title: "Điểm Ngữ pháp Trung cấp",
          htmlContent:
            "<p>Đây là giải thích về một điểm ngữ pháp trung cấp bằng tiếng Việt.</p>",
        },
      };
      const res = await request(app)
        .post("/api/grammar/")
        .set("Authorization", `Bearer ${teacherToken}`)
        .send(grammarData);
      expect(res.statusCode).toEqual(201);
      grammarIdForTeacher = res.body.data._id; // Ensuring the response structure matches
    });

    it("Admin role should create grammar with Vietnamese and English content", async () => {
      const grammarData = {
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
      };
      const res = await request(app)
        .post("/api/grammar/")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(grammarData);
      expect(res.statusCode).toEqual(201);
      grammarIdForAdmin = res.body.data._id;
    });
  });

  describe("Public Access to Grammar Entries", () => {
    it("Should get all grammars without authentication", async () => {
      const res = await request(app).get("/api/grammar/");
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it("Should get a specific grammar by ID without authentication", async () => {
      const res = await request(app).get(`/api/grammar/${grammarIdForTeacher}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty("vi.title");
    });
  });

  describe("Modify Grammar Entries", () => {
    it("User role should not be allowed to modify grammar (Forbidden)", async () => {
      const updatedContent = {
        vi: {
          title: "Điểm ngữ pháp cơ bản đã cập nhật",
          htmlContent:
            "<p>Đây là bản cập nhật giải thích về điểm ngữ pháp cơ bản bằng tiếng Việt.</p>",
        },
      };
      const res = await request(app)
        .put(`/api/grammar/${grammarIdForTeacher}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send(updatedContent);
      expect(res.statusCode).toEqual(403);
    });

    it("Admin role should modify any grammar", async () => {
      const updatedContent = {
        vi: {
          title: "Nâng cao Ngữ pháp Điểm - Cập nhật",
          htmlContent:
            "<p>Cập nhật giải thích về điểm ngữ pháp nâng cao bằng tiếng Việt.</p>",
        },
        en: {
          title: "Updated Advanced Grammar Point",
          htmlContent:
            "<p>Updated explanation of an advanced grammar point in English.</p>",
        },
        jp: {
          title: "高度な文法ポイント",
          htmlContent: "<p>これは高度な文法ポイントの説明です。</p>",
        },
      };
      const res = await request(app)
        .put(`/api/grammar/${grammarIdForAdmin}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updatedContent);
      expect(res.statusCode).toEqual(200);
    });

    it("Teacher role should modify their own grammar's content", async () => {
      const updatedContentForTeacher = {
        vi: {
          title: "Điểm ngữ pháp trung cấp đã cập nhật",
          htmlContent:
            "<p>Đây là bản cập nhật giải thích về điểm ngữ pháp trung cấp bằng tiếng Việt.</p>",
        },
      };
      const res = await request(app)
        .put(`/api/grammar/${grammarIdForTeacher}`)
        .set("Authorization", `Bearer ${teacherToken}`)
        .send(updatedContentForTeacher);
      expect(res.statusCode).toEqual(200);
    });
  });

  describe("Delete Grammar Entries", () => {
    it("User role should not be allowed to delete grammar (Forbidden)", async () => {
      const res = await request(app)
        .delete(`/api/grammar/${grammarIdForTeacher}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(403);
    });

    it("Teacher role should delete their own grammar", async () => {
      const res = await request(app)
        .delete(`/api/grammar/${grammarIdForTeacher}`)
        .set("Authorization", `Bearer ${teacherToken}`);
      expect(res.statusCode).toEqual(200);
    });

    it("Admin role should delete any grammar", async () => {
      const res = await request(app)
        .delete(`/api/grammar/${grammarIdForAdmin}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
    });
  });
});
