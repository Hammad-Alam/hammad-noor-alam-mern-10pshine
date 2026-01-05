import mongoose from "mongoose";
import dotenv from "dotenv";
import { expect, use } from "chai"; // Named imports for Chai v6
import chaiHttp from "chai-http";
import app from "../index.js";
import User from "../models/UserModel.js";

dotenv.config();

const chai = use(chaiHttp); // Initialize chai-http plugin

describe("Auth APIs", function () {
  this.timeout(20000); // Timeout for async operations

  let token;

  const testUser = {
    name: "Test User",
    email: "testuser@gmail.com",
    password: "Test@1234",
  };

  // Connect DB before tests
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({});
  });

  // Cleanup DB after tests
  after(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  // Register API - Test cases
  describe("POST /api/auth/register", () => {
    it("should register a user successfully", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/auth/register")
        .send(testUser);

      expect(res).to.have.status(201);
      expect(res.body.status).to.equal("success");
    });

    it("should fail when email already exists", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/auth/register")
        .send(testUser);

      expect(res).to.have.status(400);
      expect(res.body.message).to.equal("Email already registered");
    });
  });

  // Login API - Test cases
  describe("POST /api/auth/login", () => {
    it("should login user successfully", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/auth/login")
        .send({ email: testUser.email, password: testUser.password });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("token");

      token = res.body.token;
    });

    it("should fail with wrong password", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/auth/login")
        .send({ email: testUser.email, password: "WrongTest123@" });

      expect(res).to.have.status(401);
    });
  });

  // Get logged-in user API
  describe("GET /api/auth/me", () => {
    it("should return logged-in user successfully", async () => {
      const res = await chai.request
        .execute(app)
        .get("/api/auth/me")
        .set("Cookie", [`token=${token}`]);

      expect(res).to.have.status(200);
      expect(res.body.user).to.have.property("email");
    });

    it("should fail without token", async () => {
      const res = await chai.request.execute(app).get("/api/auth/me");
      expect(res).to.have.status(401);
    });
  });

  // Logout API
  describe("POST /api/auth/logout", () => {
    it("should logout successfully", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/auth/logout")
        .set("Cookie", [`token=${token}`]);

      expect(res).to.have.status(200);
      expect(res.body.message).to.equal("Logout successful");
    });

    it("should fail without token", async () => {
      const res = await chai.request.execute(app).post("/api/auth/logout");
      expect(res).to.have.status(401);
    });
  });

  // Forgot Password API
  describe("POST /api/auth/forgot-password", () => {
    it("should send OTP successfully", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/auth/forgot-password")
        .send({ email: testUser.email });

      expect(res).to.have.status(200);
    });

    it("should fail for non-registered email", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/auth/forgot-password")
        .send({ email: "WrongTest123@gmail.com" });

      expect(res).to.have.status(404);
    });
  });

  // Reset Password API
  describe("POST /api/auth/reset-password", () => {
    it("should fail with invalid OTP", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/auth/reset-password")
        .send({
          email: testUser.email,
          otp: "000000",
          newPassword: "Test@789",
          confirmPassword: "Test@789",
        });

      expect(res).to.have.status(400);
    });

    it("should fail when passwords do not match", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/auth/reset-password")
        .send({
          email: testUser.email,
          otp: "000000",
          newPassword: "Test@789",
          confirmPassword: "Test@7890",
        });

      expect(res).to.have.status(400);
    });
  });
});
