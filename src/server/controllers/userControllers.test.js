const bcrypt = require("bcrypt");
const path = require("path");
const User = require("../../db/models/User");
const { userRegister, loginUser } = require("./userControllers");

const expectedToken = "YouKilledMyFather";

const user = {
  name: "Boo",
  username: "Bobobo",
  password: "123456789",
  id: 13,
};

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
        name: "Boo",
        username: "Bobobo",
        password: "12345689",
      },
    };

    test("Then it should respond with the statusCode 200", async () => {
      const expectedStatusCode = 200;
      const next = jest.fn();

      await loginUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });

    test("Then it should respond with the res.json method 'YouKilledMyFather'", async () => {
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

const imageName = "userImage.PNG";
const createdUser = {
  ...user,
  image: imageName,
  friends: [],
  enemies: [],
  id: 1,
};

jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
  rename: () => imageName,
}));

describe("Given the userRegister function", () => {
  describe("When invoked with according user credentials on a req' body and file as string on req' file and this not exist", () => {
    test("Then it should call the res-method status 201 and method json with the new user created", async () => {
      jest.spyOn(bcrypt, "hash").mockResolvedValue(user.password);
      User.findOne = jest
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      User.create = jest.fn().mockResolvedValue(createdUser);
      const req = {
        file: { originalmame: imageName, fieldname: imageName },
        body: user,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
      jest.spyOn(path, "join").mockResolvedValue(imageName);
      const expectStatusValue = 201;
      const expectJson = { user: createdUser };

      await userRegister(req, res, next);

      expect(res.status).toHaveBeenCalledWith(expectStatusValue);
      expect(res.json).toHaveBeenCalledWith(expectJson);
    });
  });

  describe("When called but the username is already existing", () => {
    test("Then it should call with the res' method status 409 and method json", async () => {
      User.findOne = jest.fn().mockResolvedValueOnce(createdUser);
      const next = jest.fn();
      const req = {
        file: { originalmame: imageName, fieldname: imageName },
        body: user,
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await userRegister(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When called but the findOne functions rejects its target", () => {
    test("Then it should call next function", async () => {
      User.findOne = jest.fn().mockRejectedValue();
      const next = jest.fn();
      const req = {
        file: { originalmame: imageName, fieldname: imageName },
        body: user,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await userRegister(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
jest.mock("../../db/models/User", () => ({
  findOne: jest.fn().mockResolvedValue(user),
}));

jest.mock("jsonwebtoken", () => ({
  sign: () => expectedToken,
}));
