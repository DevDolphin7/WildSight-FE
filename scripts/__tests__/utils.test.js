import { validateSignUp, validateLogin } from "../utils";

describe("validateSignUp", () => {
  describe("Data types", () => {
    test("Returns an object where every value is boolean", () => {
      const input = {
        username: "",
        email: "",
        password: "",
      };
      const output = validateSignUp(input);

      const values = Object.values(output);
      expect(values.length).toBe(3);
      values.forEach((value) => expect(typeof value).toBe("boolean"));
    });
    test("Returns {username: false, email: false, password: false} on a blank object", () => {
      const input = {};
      const output = validateSignUp(input);
      expect(output).toEqual({
        username: false,
        email: false,
        password: false,
      });
    });
  });
  describe("Functionality", () => {
    test("Sets username: false where characters for username include anything other than [A-Za-z0-9-] or is less than 3 chars", () => {
      const input = {
        username: "Hel_lo",
        email: "hello@world.com",
        password: "He110@World",
      };
      const output = validateSignUp(input);
      expect(output).toEqual({
        username: false,
        email: true,
        password: true,
      });
    });
    test("Sets email: false where an invalid email address is provided", () => {
      const input = {
        username: "Hello",
        email: "hello@world@com",
        password: "He110@World",
      };
      const output = validateSignUp(input);
      expect(output).toEqual({
        username: true,
        email: false,
        password: true,
      });
    });
    test("Sets password: false where an invalid password is provided (needs 8-24 chars, an upper and lower case, a number and a symbol @#$%^&+=)", () => {
      const input = {
        username: "Hello",
        email: "hello@world.com",
        password: "HelloWorld",
      };
      const output = validateSignUp(input);
      expect(output).toEqual({
        username: true,
        email: true,
        password: false,
      });
    });
    test("Expects 3 keys: username, email, password. Returns a value of false where any key is missing", () => {
      const input = {
        username: "Hello",
      };
      const output = validateSignUp(input);
      expect(output).toEqual({
        username: true,
        email: false,
        password: false,
      });
    });
    test("Returns {username: true, email: true, password: true} on a valid input", () => {
      const input = {
        username: "Hello",
        email: "hello@world.com",
        password: "He110@World",
      };
      const output = validateSignUp(input);
      expect(output).toEqual({
        username: true,
        email: true,
        password: true,
      });
    });
  });
  describe("Function purity", () => {
    test("Does not mutate the input", () => {
      const input = {
        username: "Hello",
        email: "hello@world.com",
        password: "He110@World",
      };
      const inputCopy = JSON.parse(JSON.stringify(input));

      validateSignUp(input);

      expect(input).toEqual(inputCopy);
    });
  });
});
describe("validateLogin", () => {
  describe("Data types", () => {
    test("Returns an object where every value is boolean", () => {
      const input = {
        usernameOrEmail: "",
        password: "",
      };
      const output = validateLogin(input);

      const values = Object.values(output);
      expect(values.length).toBe(2);
      values.forEach((value) => expect(typeof value).toBe("boolean"));
    });
    test("Returns {usernameOrEmail: false, password: false} on a blank object", () => {
      const input = {};
      const output = validateLogin(input);
      expect(output).toEqual({
        usernameOrEmail: false,
        password: false,
      });
    });
  });
  describe("Functionality", () => {
    test("Sets usernameOrEmail: false where characters for a username include anything other than [A-Za-z0-9-] or is less than 3 chars", () => {
      const input = {
        usernameOrEmail: "Hel_lo",
        password: "He110@World",
      };
      const output = validateLogin(input);
      expect(output).toEqual({
        usernameOrEmail: false,
        password: true,
      });
    });
    test("Sets usernameOrEmail: false where an invalid email address is provided", () => {
      const input = {
        usernameOrEmail: "hello@world@com",
        password: "He110@World",
      };
      const output = validateLogin(input);
      expect(output).toEqual({
        usernameOrEmail: false,
        password: true,
      });
    });
    test("Sets password: false where an invalid password is provided (needs 8-24 chars, an upper and lower case, a number and a symbol @#$%^&+=)", () => {
      const input = {
        usernameOrEmail: "Hello",
        password: "HelloWorld",
      };
      const output = validateLogin(input);
      expect(output).toEqual({
        usernameOrEmail: true,
        password: false,
      });
    });
    test("Expects 2 keys: usernameOrEmail, password. Returns a value of false where any key is missing", () => {
      const input = {
        usernameOrEmail: "Hello",
      };
      const output = validateLogin(input);
      expect(output).toEqual({
        usernameOrEmail: true,
        password: false,
      });
    });
    test("Returns {usernameorEmail: true, password: true} on a valid input", () => {
      const input = {
        usernameOrEmail: "hello@world.com",
        password: "He110@World",
      };
      const output = validateLogin(input);
      expect(output).toEqual({
        usernameOrEmail: true,
        password: true,
      });
    });
  });
  describe("Function purity", () => {
    test("Does not mutate the input", () => {
      const input = {
        usernameOrEmail: "Hello",
        password: "He110@World",
      };
      const inputCopy = JSON.parse(JSON.stringify(input));

      validateLogin(input);

      expect(input).toEqual(inputCopy);
    });
  });
});
