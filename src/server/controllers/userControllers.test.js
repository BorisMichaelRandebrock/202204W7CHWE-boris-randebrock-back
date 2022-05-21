const { loginUser } = require("./userControllers");

const expectedToken = "YouKilledMyFather";
const user = {
  username: "IñigoMontoya",
  id: 13,
};

jest.mock("../../db/models/User", () => ({
  findOne: jest.fn().mockResolvedValue(user),
}));

jest.mock("bcrypt", () => ({
  compare: jest.fn().mockResolvedValue(true),
}));

jest.mock("jsonwebtoken", () => ({
  sign: () => expectedToken,
}));

describe("Given the loginUser function", () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const req = {
    body: {
      username: "JuanCa",
      password: "bribon",
    },
  };

  describe("When invoked with the correct username", () => {
    test("Then it should return the error.statusCode 200", async () => {
      const expectedStatusCode = 200;
      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });
    test("Then it should respond with the res.json method with the message 'YouKilledMyFather'", async () => {
      const expected = { token: "YouKilledMyFather" };

      await loginUser(req, res);

      expect(res.json).toBeCalledWith(expected);
    });
  });
});
