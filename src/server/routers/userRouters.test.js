const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

const app = require("..");
const connectDb = require("../../db/index");
const User = require("../../db/models/User");
const { /* mockUser, */ mockUsers } = require("../mocks/userMocks");

let mongoServer;

// beforeAll(async () => {
//   mongoServer = await MongoMemoryServer.create();
//   await connectDb(mongoServer.getUri());
// });

// afterEach(async () => {
//   await User.deleteMany({});
// });

// afterAll(async () => {
//   await mongoose.connection.close();
//   await mongoose.mongoServer.stop();
// });

describe("Given a post endpoint /users/login", () => {
  describe("when it receives a request", () => {
    test("then is should call the res.status method 200 and a token", async () => {
      mongoServer = await MongoMemoryServer.create();
      await connectDb(mongoServer.getUri());
      await User.create(mockUsers[0]);

      const response = await request(app)
        .post("/users/login")
        .send({
          name: "Boo",
          username: "Bobobo",
          password: "12345689",
        })
        .expect(200);
      await User.deleteMany({});
      await mongoose.connection.close();
      await mongoServer.stop();

      expect(response.body.token).not.toBeNull();
    });
  });
});
