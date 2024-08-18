const request = require("supertest");
const app = require("../../app");
const {
  connectTestDatabase,
  closeTestDatabase,
} = require("../../test/testDatabase");

describe("User API Tests", () => {
  let userToken,
    adminToken,
    otherUserToken,
    userId,
    otherUserId,
    adminId,
    otherAdminId;

  beforeAll(async () => {
    await connectTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  describe("User Creation and Authentication", () => {
    it("should create a new user (normal)", async () => {
      const res = await request(app)
        .post("/api/users/")
        .send({
          username: "testuser",
          email: "testuser@example.com",
          password: "Password123!",
          displayName: "Test User",
          roles: ["user"],
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("data.token");
      userToken = res.body.data.token;
      userId = res.body.data.userId;
    });

    it("should create an admin user", async () => {
      const res = await request(app)
        .post("/api/users/")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          username: "adminuser",
          email: "admin@example.com",
          password: "AdminPassword123!",
          displayName: "Admin User",
          roles: ["user", "teacher", "admin"],
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("data.token");
      adminToken = res.body.data.token;
      adminId = res.body.data.userId;
    });

    it("should not allow creation of user with an existing username", async () => {
      const res = await request(app)
        .post("/api/users/")
        .send({
          username: "testuser",
          email: "anotheremail@example.com",
          password: "Password123!",
          displayName: "Test User 2",
          roles: ["user"],
        });
      expect(res.statusCode).toEqual(409);
      expect(res.body.error.message).toContain(
        "Username or email already exists"
      );
    });

    it("should not allow creation of user with an existing email", async () => {
      const res = await request(app)
        .post("/api/users")
        .send({
          username: "uniqueuser",
          email: "testuser@example.com",
          password: "Password123!",
          displayName: "Unique User",
          roles: ["user"],
        });
      expect(res.statusCode).toEqual(409);
      expect(res.body.error.message).toEqual(
        "Username or email already exists."
      );
    });

    it("should prevent a normal user from creating an admin account", async () => {
      const res = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          username: "userasadmin",
          email: "userasadmin@example.com",
          password: "AdminPassword123!",
          displayName: "User As Admin",
          roles: ["user", "teacher", "admin"],
        });
      expect(res.statusCode).toEqual(403);
      expect(res.body.error.message).toEqual(
        "Creating an admin or teacher requires admin privileges."
      );
    });

    it("admin can create another admin user", async () => {
      const res = await request(app)
        .post("/api/users/admin")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          username: "adminuser2",
          email: "admin2@example.com",
          password: "AdminPassword123!",
          displayName: "Admin User 2",
          roles: ["user", "teacher", "admin"],
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("data.token");
      expect(res.body.data).toHaveProperty("userId");
      otherAdminId = res.body.data.userId; // Save for later tests
    });

    describe("User Login", () => {
      it("should login the user and return a token", async () => {
        const res = await request(app).post("/api/users/login").send({
          identifier: "testuser@example.com",
          password: "Password123!",
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("data.token");
        userToken = res.body.data.token; // Refresh user token if necessary
      });

      it("should login the admin and return a token", async () => {
        const res = await request(app).post("/api/users/login").send({
          identifier: "admin@example.com",
          password: "AdminPassword123!",
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("data.token");
        adminToken = res.body.data.token; // Refresh admin token if necessary
      });

      it("should create a second normal user", async () => {
        const res = await request(app)
          .post("/api/users/")
          .send({
            username: "seconduser",
            email: "seconduser@example.com",
            password: "Password1234!",
            displayName: "Second User",
            roles: ["user"],
          });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("data.token");
        otherUserToken = res.body.data.token;
        otherUserId = res.body.data.userId; // This is important for the test below
      });
    });
  });

  describe("User Data Access", () => {
    it("normal user can get their own details", async () => {
      const res = await request(app)
        .get(`/api/users/private/${userId}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("data.userId", userId);
    });

    it("admin can get details of any user", async () => {
      const res = await request(app)
        .get(`/api/users/private/${otherUserId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("data.userId", otherUserId);
    });

    it("normal user cannot get details of another user", async () => {
      const res = await request(app)
        .get(`/api/users/private/${otherUserId}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(403);
      expect(res.body.error.message).toContain("Access denied.");
    });

    it("any user can access public user data", async () => {
      const res = await request(app).get(`/api/users/public/${otherUserId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty("userId", otherUserId);
    });
    it("should return all users data excluding sensitive information", async () => {
      const res = await request(app).get("/api/users/all");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.data).toBeInstanceOf(Array);
      if (res.body.data.length > 0) {
        res.body.data.forEach((user) => {
          expect(user).not.toHaveProperty("passwordHash");
          expect(user).not.toHaveProperty("username");
          expect(user).not.toHaveProperty("email");
          expect(user).not.toHaveProperty("preferences.notificationSettings");
          expect(user).not.toHaveProperty("_id");
          expect(user).toHaveProperty("userId");
        });
      }
    });
  });

  describe("User Updates", () => {
    it("user updates their own account", async () => {
      const res = await request(app)
        .put(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ displayName: "Updated User" });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("data.displayName", "Updated User");
    });

    it("user cannot update another user's account", async () => {
      const res = await request(app)
        .put(`/api/users/${otherUserId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ displayName: "Should Not Work" });
      expect(res.statusCode).toEqual(403);
      expect(res.body.error.message).toContain(
        "Not authorized to access this resource"
      );
    });

    it("admin updates a regular user's account", async () => {
      const res = await request(app)
        .put(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ displayName: "Admin Updated User" });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("data.displayName", "Admin Updated User");
    });

    it("admin cannot update another admin's account", async () => {
      const res = await request(app)
        .put(`/api/users/${otherAdminId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ displayName: "Attempt to Update Admin" });
      expect(res.statusCode).toEqual(403);
      expect(res.body.error.message).toContain(
        "Admins cannot modify other admin accounts."
      );
    });
  });

  describe("User Deletion", () => {
    it("user tries to delete their account", async () => {
      const res = await request(app)
        .delete(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(403);
      expect(res.body.error.message).toEqual(
        "Forbidden: Insufficient privileges"
      );
    });

    it("admin tries to delete a user account", async () => {
      const res = await request(app)
        .delete(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty(
        "data.message",
        "User and associated progress deleted successfully."
      );
    });

    it("admin cannot delete another admin's account", async () => {
      const res = await request(app)
        .delete(`/api/users/${otherAdminId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(403);
      expect(res.body.error.message).toEqual(
        "Admins cannot modify other admin accounts."
      );
    });
  });

  describe("Teacher Creation Authorization", () => {
    it("should not allow creation of a teacher account without a token", async () => {
      const res = await request(app)
        .post("/api/users/teacher")
        .send({
          username: "teachernotoken",
          email: "teachernotoken@example.com",
          password: "Teacher123!",
          displayName: "Teacher NoToken",
          roles: ["teacher"],
        });
      expect(res.statusCode).toEqual(401); // Checking for status code 401 which is for Unauthorized access
      expect(res.body.error.message).toContain("No token provided"); // Make sure the message aligns with your authMiddleware's output
    });

    it("should not allow a normal user to create a teacher account", async () => {
      const res = await request(app)
        .post("/api/users/teacher")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          username: "teacherbyuser",
          email: "teacherbyuser@example.com",
          password: "Teacher123!",
          displayName: "Teacher ByUser",
          roles: ["teacher"],
        });
      expect(res.statusCode).toEqual(403);
      expect(res.body.error.message).toContain(
        "Forbidden: Insufficient privileges"
      ); // Corrected to match the middleware's error message
    });

    it("should allow an admin to create a teacher account", async () => {
      const res = await request(app)
        .post("/api/users/teacher")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          username: "teacherbyadmin",
          email: "teacherbyadmin@example.com",
          password: "Teacher123!",
          displayName: "Teacher ByAdmin",
          roles: ["teacher"],
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("data.token");
      expect(res.body.data).toHaveProperty("userId");
    });
  });

  describe("Unauthorized Role Assignment", () => {
    it("should prevent an unauthenticated request from creating an admin account", async () => {
      const res = await request(app)
        .post("/api/users/")
        .send({
          username: "unauthadmin",
          email: "unauthadmin@example.com",
          password: "Admin123!",
          displayName: "Unauth Admin",
          roles: ["admin"],
        });
      expect(res.statusCode).toEqual(403);
      expect(res.body.error.message).toContain(
        "Creating an admin or teacher requires admin privileges."
      );
    });

    it("should prevent a normal user from creating an admin account", async () => {
      const res = await request(app)
        .post("/api/users/")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          username: "normaluserasadmin",
          email: "normaladmin@example.com",
          password: "Admin123!",
          displayName: "Normal User as Admin",
          roles: ["admin"],
        });
      expect(res.statusCode).toEqual(403);
      expect(res.body.error.message).toContain(
        "Creating an admin or teacher requires admin privileges."
      );
    });

    it("should prevent a normal user from creating a teacher account using the general user endpoint", async () => {
      const res = await request(app)
        .post("/api/users/")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          username: "normaluserteacher",
          email: "normalteach@example.com",
          password: "Teacher123!",
          displayName: "Normal User as Teacher",
          roles: ["user", "teacher"],
        });
      expect(res.statusCode).toEqual(403);
      expect(res.body.error.message).toContain(
        "Creating an admin or teacher requires admin privileges."
      );
    });
  });
});
