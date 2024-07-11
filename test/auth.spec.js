// test/auth.spec.js
const request = require("supertest");
const app = require("../app"); // Adjust path as needed
const { pool } = require("./setup"); // Correct import from setup.js

describe("Authentication Endpoints", () => {
  // Clear users and organisations table before each test
  beforeEach(async () => {
    await pool.query("DELETE FROM users");
    await pool.query("DELETE FROM organisations");
  });

  // Close the pool after all tests are done
  afterAll(async () => {
    await pool.end(); // Close the pool after all tests are done
  });

  // Helper function to register a user
  const registerUser = async (userData) => {
    const res = await request(app).post("/auth/register").send(userData);
    return res;
  };

  // Helper function to login a user
  const loginUser = async (credentials) => {
    const res = await request(app).post("/auth/login").send(credentials);
    return res;
  };

  // Test case: Register user successfully with default organisation
  it("should register user successfully with default organisation", async () => {
    const userData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      phone: "1234567890",
    };
    const res = await registerUser(userData);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("Registration successful");
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.firstName).toBe(userData.firstName);
    // Add more assertions as needed
  });

  // Test case: Log in user successfully
  it("should log in user successfully", async () => {
    // First, register a user
    const userData = {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      password: "password123",
    };
    await registerUser(userData);

    // Now, attempt to log in with registered credentials
    const credentials = {
      email: userData.email,
      password: userData.password,
    };
    const res = await loginUser(credentials);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("Login successful");
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.firstName).toBe(userData.firstName);
    // Add more assertions as needed
  });

  // Add more test cases as per your requirements
});
