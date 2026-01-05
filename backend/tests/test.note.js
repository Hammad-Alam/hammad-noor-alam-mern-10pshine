import mongoose from "mongoose";
import dotenv from "dotenv";
import { expect, use } from "chai"; // Named imports for Chai v6
import chaiHttp, { request } from "chai-http";
import app from "../index.js";
import User from "../models/UserModel.js";

dotenv.config();

const chai = use(chaiHttp); // Initialize chai-http plugin

describe("Note APIs", function () {
  this.timeout(20000); // Timeout for async operations

  let token;
  let noteId;

  const testNote = {
    title: "Test Note",
    description: "This is a test note",
    category: "work",
    isPinned: false,
  };

  // Connect DB and perform authentication before tests
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({});

    await chai.request.execute(app).post("/api/auth/register").send({
      name: "Test User",
      email: "testuser@gmail.com",
      password: "Test@123",
    });

    // Login to get token
    const res = await chai.request.execute(app).post("/api/auth/login").send({
      email: "testuser@gmail.com",
      password: "Test@123",
    });
    token = res.body.token;
  });

  // Cleanup DB after tests
  after(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  //   Create Note API - Test cases
  describe("POST /api/note/create", () => {
    it("should create a note successfully", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/note/create")
        .set("Cookie", [`token=${token}`])
        .send(testNote);

      expect(res).to.have.status(201);
      expect(res.body.data).to.have.property("title", "Test Note");
      noteId = res.body.data._id;
    });

    it("should not create note when title is missing", async () => {
      const res = await chai.request
        .execute(app)
        .post("/api/note/create")
        .set("Cookie", [`token=${token}`])
        .send({ description: "Title is missing" });

      expect(res).to.have.status(500);
    });
  });

  //   Get all Notes API - Test cases
  describe("GET /api/note/", () => {
    it("should fetch all notes", async () => {
      const res = await chai.request
        .execute(app)
        .get("/api/note/")
        .set("Cookie", [`token=${token}`]);

      expect(res).to.have.status(200);
    });

    it("should not fetch notes when token is missing", async () => {
      const res = await chai.request.execute(app).get("/api/note/");

      expect(res).to.have.status(401);
    });
  });

  // Get Note by Id - Test cases
  describe("GET /api/note/:noteId", () => {
    it("should fetch single note", async () => {
      const res = await chai.request
        .execute(app)
        .get(`/api/note/${noteId}`)
        .set("Cookie", [`token=${token}`]);

      expect(res).to.have.status(200);
      expect(res.body.status).to.equal("success");
    });

    it("should not fetch a note when token is missing", async () => {
      const res = await chai.request.execute(app).get("/api/note/:noteId");

      expect(res).to.have.status(401);
    });
  });

  // Update Note API - Test cases
  describe("PATCH /api/note/:noteId", () => {
    it("it should update a note successfully", async () => {
      const res = await chai.request
        .execute(app)
        .patch(`/api/note/${noteId}`)
        .set("Cookie", [`token=${token}`])
        .send({ title: "Test Note Updated" });

      expect(res).to.have.status(200);
      expect(res.body.data).to.have.property("title");
    });

    it("it should not update a note when note Id is missing", async () => {
      const res = await chai.request
        .execute(app)
        .patch(`/api/note/`)
        .set("Cookie", [`token=${token}`])
        .send({ title: "Test Note Updated" });

      expect(res).to.have.status(404);
    });
  });

  // Mark note as pinned API - Test cases
  describe("PATCH /api/note/:noteId/pin", () => {
    it("should mark the note as pinned successfully", async () => {
      const res = await chai.request
        .execute(app)
        .patch(`/api/note/${noteId}/pin`)
        .set("Cookie", [`token=${token}`]);

      expect(res).to.have.status(200);
      expect(res.body.message).to.equal("Note marked as pinned successfully");
    });

    it("should fail when the token is missing", async () => {
      const res = await chai.request
        .execute(app)
        .patch(`/api/note/${noteId}/pin`);

      expect(res).to.have.status(401);
    });
  });

  // Delete Note API - Test cases
  describe("DELETE /api/note/:noteId", () => {
    it("it should delete a note successfully", async () => {
      const res = await chai.request
        .execute(app)
        .patch(`/api/note/${noteId}`)
        .set("Cookie", [`token=${token}`]);

      expect(res).to.have.status(200);
      expect(res.body.status).to.equal("success");
    });

    it("it should not delete a note when note Id is missing", async () => {
      const res = await chai.request
        .execute(app)
        .patch(`/api/note/`)
        .set("Cookie", [`token=${token}`]);

      expect(res).to.have.status(404);
    });
  });
});
