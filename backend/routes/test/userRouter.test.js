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

  // Create a new regular user
  it("should create a new user (normal)", async () => {
    const res = await request(app).post("/api/user").send({
      username: "testuser",
      email: "testuser@example.com",
      password: "Password123",
      displayName: "Test User",
      role: "user",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token");
    userToken = res.body.token;
    userId = res.body.userId;
  });

  // Create an admin user
  it("should create an admin user", async () => {
    const res = await request(app).post("/api/user").send({
      username: "adminuser",
      email: "admin@example.com",
      password: "AdminPassword123",
      displayName: "Admin User",
      role: "admin",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token");
    adminToken = res.body.token;
  });

  // Attempt to create a user with an existing username
  it("should not allow creation of user with an existing username", async () => {
    const res = await request(app).post("/api/user").send({
      username: "testuser", // Existing username
      email: "uniqueemail@example.com",
      password: "Password123",
      displayName: "Test User New",
      role: "user",
    });
    expect(res.statusCode).toEqual(400); // Assuming 400 for duplicate username
  });

  // Attempt to create a user with an existing email
  it("should not allow creation of user with an existing email", async () => {
    const res = await request(app).post("/api/user").send({
      username: "uniqueusername",
      email: "testuser@example.com", // Existing email
      password: "Password123",
      displayName: "Unique User",
      role: "user",
    });
    expect(res.statusCode).toEqual(400); // Assuming 400 for duplicate email
  });

  // Login as the regular user
  it("should login the user and return a token", async () => {
    const res = await request(app).post("/api/users/login").send({
      identifier: "testuser@example.com",
      password: "Password123",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
    userToken = res.body.token; // Refresh token if necessary
  });

  // Login as the admin
  it("should login the admin and return a token", async () => {
    const res = await request(app).post("/api/users/login").send({
      identifier: "admin@example.com",
      password: "AdminPassword123",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
    adminToken = res.body.token; // Refresh token if necessary
  });

  // Get the current user with user token
  it("should get the current user details with user token", async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`) // Ensure userId is correctly assigned after user creation
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    // Assuming _id is returned; adjust based on actual response structure
    expect(res.body).toHaveProperty("_id");
  });

  // Get the current user with admin token
  it("should get the same user details with admin token", async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`) // Ensure userId is correctly assigned after user creation
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    // Assuming _id is returned; adjust based on actual response structure
    expect(res.body).toHaveProperty("_id");
  });

  // Get the current user with no token
  it("should not get user details without a token", async () => {
    const res = await request(app).get(`/api/users/${userId}`); // Ensure userId is correctly assigned after user creation
    expect(res.statusCode).toEqual(401); // Assuming unauthorized access returns 401
  });

  // User updates its own account
  it("User updates its own account", async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ displayName: "Updated User Name" });
    expect(res.statusCode).toEqual(200);
  });

  it("Create a second normal user", async () => {
    const res = await request(app).post("/api/user").send({
      username: "testuser2",
      email: "testuser2@example.com",
      password: "Password123",
      displayName: "Test User 2",
      role: "user",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token");
    otherUserToken = res.body.token;
    otherUserId = res.body.userId;
  });

  // User tries to update another user's account
  it("User tries to update another user's account", async () => {
    const res = await request(app)
      .put(`/api/users/${otherUserId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ displayName: "Should Not Work" });
    expect(res.statusCode).toEqual(403);
  });

  // Admin updates a regular user's account
  it("Admin updates a regular user's account", async () => {
    const res = await request(app)
      .put(`/api/users/${otherUserId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ displayName: "Admin Updated second User" });
    expect(res.statusCode).toEqual(200);
  });

  //Admin Create 2nd admin user
  it("should create a second admin user", async () => {
    const res = await request(app)
      .post("/api/admin/user")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        username: "adminuser2",
        email: "admin2@example.com",
        password: "AdminPassword123",
        displayName: "Admin User 2",
        role: "admin",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token");
    otherAdminId = res.body.userId;
  });

  // Admin tries to update another admin's account
  it("Admin tries to update another admin's account", async () => {
    const res = await request(app)
      .put(`/api/users/${otherAdminId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ displayName: "Attempt to Update Admin" });
    expect(res.statusCode).toEqual(403);
  });

  // User tries to delete their account
  it("User tries to delete their account", async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(403); // Assuming regular users cannot delete accounts
  });

  // Admin tries to delete a user account
  it("Admin tries to delete a user account", async () => {
    const res = await request(app)
      .delete(`/api/users/${otherUserId}`) // Ensure to create and use a disposable user account for this test
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
  });
});
