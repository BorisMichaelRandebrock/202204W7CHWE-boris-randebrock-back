const { notFoundError, generalError } = require("./errors");

describe("Given the errors middlware function", () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  describe("When invoked with a res.status(404).json method", () => {
    test("Then it should respond with the message 'Endpoint not found'", () => {
      const expectedStatus = 404;

      notFoundError(null, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });
  describe("When invoked with a rquest", () => {
    test("Then it should call the response method json with 'Endpoint not found", () => {
      const expectedMessage = { message: "Endpoint not found" };

      notFoundError(null, res);

      expect(res.json).toHaveBeenCalledWith(expectedMessage);
    });
  });
});

describe("Given the generalError middleware function", () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  describe("When invoked with a errorCode(500)", () => {
    const error = Error;
    test("Then it should respond with the errorCode 500", () => {
      const expectedStatus = 500;

      generalError(error, null, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
    test("Then it should respond with the error message'Major General Peter", () => {
      const errorMessage = "Major General Peter";
      const expectedMessage = { message: errorMessage };

      generalError(error, null, res);

      expect(res.json).toBeCalledWith(expectedMessage);
    });
  });
  describe("When", () => {
    test("Then ", () => {
      const error = new Error();
      error.code = 401;
      error.message = "my name is Iñigo Montoya";

      const expectedCode = 203;

      generalError(error, null, res);

      expect(res.status).not.toBe(expectedCode);
    });
  });
});
