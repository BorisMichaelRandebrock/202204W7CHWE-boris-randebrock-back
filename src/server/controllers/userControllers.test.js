const bcrypt = require("bcrypt");
const User = require("../../db/models/User");
const { loginUser } = require("./userControllers");

const expectedToken = "YouKilledMyFather";

const user = {
  username: "IñigoMontoya",
  password: "correctPassord",
  id: 13,
};

jest.mock("../../db/models/User", () => ({
  findOne: jest.fn().mockResolvedValue(user),
}));

jest.mock("jsonwebtoken", () => ({
  sign: () => expectedToken,
}));

describe("Given the loginUser function", () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  jest.mock("bcrypt", () => ({
    compare: jest.fn().mockResolvedValue(true),
  }));
  describe("When invoked with the correct username", () => {
    const req = {
      body: {
        username: "JuanCa",
        password: "bribon",
      },
    };
    test("Then it should respond the statusCode 200", async () => {
      const expectedStatusCode = 200;
      const next = jest.fn();

      await loginUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });
    test("Then it should respond with the res.json method with the message 'YouKilledMyFather'", async () => {
      const expected = { token: "YouKilledMyFather" };
      const next = jest.fn();

      await loginUser(req, res, next);

      expect(res.json).toBeCalledWith(expected);
    });
  });
  describe("When invoked with an incorrect password", () => {
    test("Then it should call next", async () => {
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false);
      User.findOne = jest.fn().mockResolvedValue(user);

      const req = {
        body: {
          username: "JuanCa",
          id: "1",
          password: "bribon",
        },
      };

      const next = jest.fn();

      await loginUser(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
  describe("When invoked with an incorrect username", () => {
    test("Then it should call next", async () => {
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
      User.findOne = jest.fn().mockResolvedValue(!user);

      const req = {
        body: {
          username: "JuanCa",
          id: "1",
          password: "bribon",
        },
      };

      const next = jest.fn();

      await loginUser(req, res, next);

      expect(next).toHaveBeenCalled();
    });
    test("Then it should call next", async () => {
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
      User.findOne = jest.fn().mockResolvedValue(!user);
      const error = new Error();
      error.customMessage = "invalid user Data";

      const req = {
        body: {
          username: "JuanCa",
          id: "1",
          password: "bribon",
        },
      };

      const next = jest.fn();

      await loginUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
