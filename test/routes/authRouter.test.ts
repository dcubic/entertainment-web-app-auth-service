import request from "supertest";
import { Express } from "express-serve-static-core";
import { createApp } from "../../src/app/app";
import DatabaseConnector from "../../src/database/DatabaseConnector";
import UserDatabase from "../../src/database/users/UserDatabase";
import AuthHandler from "../../src/handlers/AuthHandler";
import StatusCodes from "../../src/utils/StatusCodes";

let databaseConnector: DatabaseConnector;
let app: Express;
let authHandler: AuthHandler;
let userDatabase: UserDatabase;

beforeAll(async () => {
  databaseConnector = new DatabaseConnector();
  const connection = await databaseConnector.connect(true);
  app = await createApp(connection);
  userDatabase = new UserDatabase(connection);
  authHandler = new AuthHandler(userDatabase);
});

afterEach(async () => {
  await databaseConnector.clearDatabase();
});

afterAll(async () => {
  await databaseConnector.disconnect();
});

describe("Sign Up", () => {
  it("error case - missing request body", async () => {
    const response = await request(app).post("/signup");

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it("error case - missing email", async () => {
    const response = await request(app)
      .post("/signup")
      .send({ password: "asdfdsa" });

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it("error case: email is not valid", async () => {
    const response = await request(app)
      .post("/signup")
      .send({ email: "yoloswaggins", password: "cookiemonster" });

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it("error case - missing password", async () => {
    const response = await request(app)
      .post("/signup")
      .send({ email: "yoloswaggins@hotdog.com" });

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it("error case - a user already exists with the specified email", async () => {
    const email = "pizzapop@hotmail.com";
    const password = "gandalf123";
    await authHandler.signup(email, password);

    const newPassword = "asdfdsa";
    const response = await request(app)
      .post("/signup")
      .send({ email, password: newPassword });

    expect(response.status).toBe(StatusCodes.CONFLICT);

    expect(
      response.body as {
        errors: [{ fieldName: string; message: string; kind: string }];
      }
    ).toEqual({
      errors: [
        {
          fieldName: "email",
          message:
            "Error, expected `email` to be unique. Value: `pizzapop@hotmail.com`",
          kind: "unique",
        },
      ],
    });
  });

  it("success case - no user with the same email exists", async () => {
    const email = "hotdog@pizza.com";
    const password = "JamiesonB100";

    const response = await request(app)
      .post("/signup")
      .send({ email, password });

    expect(response.status).toBe(StatusCodes.OK);

    const user = await userDatabase.getUserByEmail(email);
    expect(user.email).toBe(email);
  });
});

describe("Login", () => {
  it("error case - missing request body", async () => {
    const response = await request(app).post("/login");

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it("error case - missing email", async () => {
    const response = await request(app)
      .post("/login")
      .send({ password: "asdfdsa" });

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it("error case: email is not valid", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "yoloswaggins", password: "cookiemonster" });

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it("error case - missing password", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "yoloswaggins@hotdog.com" });

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it("error case - no such user exists", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "tatertots@pizza.com", password: "eskimos" });
  });

  it("success case", async () => {});
});
