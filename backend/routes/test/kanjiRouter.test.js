const request = require("supertest");
const app = require("../../app");
const {
  connectTestDatabase,
  closeTestDatabase,
} = require("../../test/testDatabase");

describe("Kanji API Tests", () => {
  let userToken, teacherToken, adminToken;
  let kanjiIdForTeacher, kanjiIdForAdmin;

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

  describe("Create Kanji Entries", () => {
    it("User role should not create kanji (Forbidden)", async () => {
      const res = await request(app)
        .post("/api/kanji/")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          character: "水",
          meaning: {
            jp: "水",
            en: "water",
            vi: "nước",
          },
          sinoVietnameseSounds: "thủy",
          onyomi: ["スイ"],
          kunyomi: ["みず"],
          examples: [
            {
              kanjiWord: "水曜日",
              hiragana: "すいようび",
              meaning: {
                en: "Wednesday",
                vi: "Thứ tư",
              },
            },
          ],
        });
      expect(res.statusCode).toEqual(403);
    });

    it("Teacher role should create kanji", async () => {
      const res = await request(app)
        .post("/api/kanji/")
        .set("Authorization", `Bearer ${teacherToken}`)
        .send({
          character: "木",
          meaning: {
            jp: "木",
            en: "tree",
            vi: "cây",
          },
          sinoVietnameseSounds: "mộc",
          onyomi: ["ボク", "モク"],
          kunyomi: ["き", "こ"],
          examples: [
            {
              kanjiWord: "木曜日",
              hiragana: "もくようび",
              meaning: {
                en: "Thursday",
                vi: "Thứ năm",
              },
            },
          ],
        });
      expect(res.statusCode).toEqual(201);
      kanjiIdForTeacher = res.body.data._id;
    });

    it("Admin role should create kanji", async () => {
      const res = await request(app)
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
      kanjiIdForAdmin = res.body.data._id;
    });
  });

  describe("Public Access to Kanji", () => {
    it("Should get all Kanjis without authentication", async () => {
      const res = await request(app).get("/api/kanji/");
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it("Should get a specific Kanji by ID without authentication", async () => {
      const res = await request(app).get(`/api/kanji/${kanjiIdForTeacher}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty("character", "木");
    });
  });

  describe("Modify Kanji Entries", () => {
    it("User role should not modify any kanji (Forbidden)", async () => {
      const updatedData = {
        character: "風",
        meaning: {
          jp: "風",
          en: "wind",
          vi: "gió",
        },
        sinoVietnameseSounds: "phong",
        onyomi: ["フウ", "フ"],
        kunyomi: ["かぜ", "かざ-"],
        examples: [
          {
            kanjiWord: "台風",
            hiragana: "たいふう",
            meaning: {
              en: "Typhoon",
              vi: "Bão",
            },
          },
        ],
      };

      const res = await request(app)
        .put(`/api/kanji/${kanjiIdForTeacher}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send(updatedData);
      expect(res.statusCode).toEqual(403);
    });

    it("Teacher role should modify their own kanji", async () => {
      const updatedDataForTeacher = {
        character: "風",
        meaning: {
          jp: "風",
          en: "wind",
          vi: "gió",
        },
        sinoVietnameseSounds: "phong",
        onyomi: ["フウ", "フ"],
        kunyomi: ["かぜ", "かざ-"],
        examples: [
          {
            kanjiWord: "台風",
            hiragana: "たいふう",
            meaning: {
              en: "Typhoon",
              vi: "Bão",
            },
          },
        ],
      };

      const res = await request(app)
        .put(`/api/kanji/${kanjiIdForTeacher}`)
        .set("Authorization", `Bearer ${teacherToken}`)
        .send(updatedDataForTeacher);
      expect(res.statusCode).toEqual(200);
    });

    it("Admin role should modify any kanji", async () => {
      const updatedDataForAdmin = {
        character: "月",
        meaning: {
          jp: "月",
          en: "moon",
          vi: "mặt trăng",
        },
        sinoVietnameseSounds: "nguyệt",
        onyomi: ["ゲツ", "ガツ"],
        kunyomi: ["つき"],
        examples: [
          {
            kanjiWord: "月曜日",
            hiragana: "げつようび",
            meaning: {
              en: "Monday",
              vi: "Thứ hai",
            },
          },
        ],
      };

      const res = await request(app)
        .put(`/api/kanji/${kanjiIdForAdmin}`) // Admin modifies the kanji created by the admin
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updatedDataForAdmin);
      expect(res.statusCode).toEqual(200);
    });
  });

  describe("Delete Kanji Entries", () => {
    it("User role should not delete any kanji (Forbidden)", async () => {
      const res = await request(app)
        .delete(`/api/kanji/${kanjiIdForTeacher}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(403);
    });

    it("Teacher role should delete any kanji", async () => {
      const res = await request(app)
        .delete(`/api/kanji/${kanjiIdForAdmin}`)
        .set("Authorization", `Bearer ${teacherToken}`);
      expect(res.statusCode).toEqual(200);
    });

    it("Admin role should delete any kanji", async () => {
      const res = await request(app)
        .delete(`/api/kanji/${kanjiIdForTeacher}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
    });
  });
});
