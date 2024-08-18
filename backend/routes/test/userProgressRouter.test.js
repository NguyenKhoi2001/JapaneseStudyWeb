const request = require("supertest");
const app = require("../../app");
const {
  connectTestDatabase,
  closeTestDatabase,
} = require("../../test/testDatabase");

describe("User Progress API Tests", () => {
  let userToken, anotherUserToken, teacherToken;
  let lessonId1, lessonId2, lessonId3, levelId1, userId, anotherUserId;

  beforeAll(async () => {
    await connectTestDatabase();
    await setupUsersAndPrerequisites();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  async function setupUsersAndPrerequisites() {
    // Create an admin user first
    let res = await request(app)
      .post("/api/users")
      .send({
        username: "adminuser",
        email: "admin@example.com",
        password: "AdminPassword123!",
        displayName: "Admin User",
        roles: ["user", "teacher", "admin"],
      });
    const adminToken = res.body.data.token; // Store the admin token to use for creating a teacher

    // Use the admin token to create a teacher user
    res = await request(app)
      .post("/api/users/teacher")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        username: "teacheruser",
        email: "teacher@example.com",
        password: "Teacher123!",
        displayName: "Teacher User",
        roles: ["user", "teacher"],
      });
    teacherToken = res.body.data.token;

    // Create a normal user
    res = await request(app)
      .post("/api/users")
      .send({
        username: "testuser",
        email: "testuser@example.com",
        password: "Password123!",
        displayName: "Test User",
        roles: ["user"],
      });
    userToken = res.body.data.token;
    userId = res.body.data.userId;

    // Create another normal user for testing access control
    res = await request(app)
      .post("/api/users")
      .send({
        username: "anotheruser",
        email: "anotheruser@example.com",
        password: "Password123!",
        displayName: "Another User",
        roles: ["user"],
      });
    anotherUserToken = res.body.data.token;
    anotherUserId = res.body.data.userId;

    // Create lessons and a level as prerequisites
    lessonId1 = await createResource("/api/lessons", teacherToken, {
      title: {
        jp: "レッスン 1",
        en: "Lesson 1",
        vi: "Bài học 1",
      },
    });
    lessonId2 = await createResource("/api/lessons", teacherToken, {
      title: {
        jp: "レッスン 2",
        en: "Lesson 2",
        vi: "Bài học 2",
      },
    });
    lessonId3 = await createResource("/api/lessons", teacherToken, {
      title: {
        jp: "レッスン 3",
        en: "Lesson 3",
        vi: "Bài học 3",
      },
    });

    const levelResponse = await request(app)
      .post("/api/levels")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        name: "Basic Japanese",
        lessons: [lessonId1, lessonId2, lessonId3],
      });
    levelId1 = levelResponse.body.data._id;
  }

  async function createResource(apiPath, token, payload) {
    const res = await request(app)
      .post(apiPath)
      .set("Authorization", `Bearer ${token}`)
      .send(payload);
    expect(res.statusCode).toEqual(201);
    return res.body.data._id;
  }

  async function createResource(apiPath, token, payload) {
    const res = await request(app)
      .post(apiPath)
      .set("Authorization", `Bearer ${token}`)
      .send(payload);
    expect(res.statusCode).toEqual(201);
    return res.body.data._id;
  }

  describe("Add/Update User Progress", () => {
    it("should allow adding new progress for a lesson", async () => {
      const response = await request(app)
        .post("/api/userProgress")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ user: userId, lesson: lessonId1, score: 80 });
      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.passed).toBe(true);
    });

    it("should update existing progress if new score is higher", async () => {
      const response = await request(app)
        .post("/api/userProgress")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ user: userId, lesson: lessonId1, score: 90 });
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.score).toBe(90);
    });

    it("should not update existing progress if new score is lower", async () => {
      const response = await request(app)
        .post("/api/userProgress")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ user: userId, lesson: lessonId1, score: 85 });
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.score).toBe(90);
    });
  });

  describe("Get User Progress", () => {
    it("should return user progress for a given user", async () => {
      const response = await request(app)
        .get(`/api/userProgress/user/${userId}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should not allow users to access another user's progress", async () => {
      const response = await request(app)
        .get(`/api/userProgress/user/${anotherUserId}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(response.statusCode).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe("Check Lesson Start Eligibility", () => {
    // Testing for User 1
    it("User 1 should be allowed to start lesson 2 after passing lesson 1", async () => {
      // User 1 has already passed lesson 1 in a previous test
      const responseLesson2ForUser1 = await request(app)
        .get(`/api/userProgress/canStart/${userId}/${lessonId2}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(responseLesson2ForUser1.statusCode).toBe(200);
      expect(responseLesson2ForUser1.body.data.canStart).toBe(true);
    });

    it("User 1 should not be allowed to start lesson 3 without passing lesson 2", async () => {
      // User 1 has not attempted lesson 2 yet
      const responseLesson3ForUser1 = await request(app)
        .get(`/api/userProgress/canStart/${userId}/${lessonId3}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(responseLesson3ForUser1.statusCode).toBe(403);
      expect(responseLesson3ForUser1.body.success).toBe(false);
    });
    // Updating User 1's score for Lesson 2 to a passing score
    it("Updating User 1's score for Lesson 2 to a passing mark", async () => {
      const updateResponse = await request(app)
        .post("/api/userProgress")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ user: userId, lesson: lessonId2, score: 85 }); // Assuming 70 or above is passing
      expect(updateResponse.statusCode).toBe(201); // Or expect 200 if updating existing progress
      expect(updateResponse.body.success).toBe(true);
    });

    // User 1 should now be allowed to start Lesson 3 after passing Lesson 2
    it("User 1 should be allowed to start lesson 3 after passing lesson 2", async () => {
      const responseAfterUpdate = await request(app)
        .get(`/api/userProgress/canStart/${userId}/${lessonId3}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(responseAfterUpdate.statusCode).toBe(200);
      expect(responseAfterUpdate.body.data.canStart).toBe(true);
    });
    // Testing for User 2 (anotherUser)
    it("User 2 should be allowed to start lesson 1 without any prerequisites", async () => {
      const responseLesson1ForUser2 = await request(app)
        .get(`/api/userProgress/canStart/${anotherUserId}/${lessonId1}`)
        .set("Authorization", `Bearer ${anotherUserToken}`);
      expect(responseLesson1ForUser2.statusCode).toBe(200);
      expect(responseLesson1ForUser2.body.data.canStart).toBe(true);
    });

    it("User 2 should not be allowed to start lesson 2 without passing lesson 1", async () => {
      // User 2 has not attempted any lesson yet
      const responseLesson2ForUser2 = await request(app)
        .get(`/api/userProgress/canStart/${anotherUserId}/${lessonId2}`)
        .set("Authorization", `Bearer ${anotherUserToken}`);
      expect(responseLesson2ForUser2.statusCode).toBe(403);
      expect(responseLesson2ForUser2.body.success).toBe(false);
    });

    it("User 2 should not be allowed to start lesson 3 without passing previous lessons", async () => {
      // User 2 has not attempted any lesson yet
      const responseLesson3ForUser2 = await request(app)
        .get(`/api/userProgress/canStart/${anotherUserId}/${lessonId3}`)
        .set("Authorization", `Bearer ${anotherUserToken}`);
      expect(responseLesson3ForUser2.statusCode).toBe(403);
      expect(responseLesson3ForUser2.body.success).toBe(false);
    });
  });

  describe("Calculate Level Progress", () => {
    it("should calculate progress within a level correctly", async () => {
      const response = await request(app)
        .get(`/api/userProgress/progress/${userId}/${levelId1}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      // The exact progress percentage may depend on additional setup not shown here, such as passing more lessons
    });
  });
});
