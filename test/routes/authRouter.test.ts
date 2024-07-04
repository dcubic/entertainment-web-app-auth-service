import request from "supertest";
import jwt from "jsonwebtoken";
import { Express } from "express-serve-static-core";
import { createApp } from "../../src/app/app";
import DatabaseConnector from "../../src/database/DatabaseConnector";
import UserDatabase from "../../src/database/users/UserDatabase";
import AuthHandler from "../../src/handlers/AuthHandler";
import StatusCode from "../../src/utils/StatusCode";
import { BACKUP_JWT_SECRET } from "../../src/utils/constants";

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
    const response = await request(app).post("/auth/signup");

    expect(response.status).toBe(StatusCode.BAD_REQUEST);
    expect(response.body).toEqual({
      message: "Invalid email address, Password cannot be empty",
    });
  });

  it("error case - missing email", async () => {
    const response = await request(app)
      .post("/auth/signup")
      .send({ password: "asdfdsa" });

    expect(response.status).toBe(StatusCode.BAD_REQUEST);
    expect(response.body).toEqual({
      message: "Invalid email address",
    });
  });

  it("error case: email is not valid", async () => {
    const response = await request(app)
      .post("/auth/signup")
      .send({ email: "yoloswaggins", password: "cookiemonster" });

    expect(response.status).toBe(StatusCode.BAD_REQUEST);
    expect(response.body).toEqual({
      message: "Invalid email address",
    });
  });

  it("error case - missing password", async () => {
    const response = await request(app)
      .post("/auth/signup")
      .send({ email: "yoloswaggins@hotdog.com" });

    expect(response.status).toBe(StatusCode.BAD_REQUEST);
    expect(response.body).toEqual({
      message: "Password cannot be empty",
    });
  });

  it("error case - a user already exists with the specified email", async () => {
    const email = "pizzapop@hotmail.com";
    const password = "gandalf123";
    await authHandler.signup(email, password);

    const newPassword = "asdfdsa";
    const response = await request(app)
      .post("/auth/signup")
      .send({ email, password: newPassword });

    expect(response.status).toBe(StatusCode.CONFLICT);

    expect(
      response.body as {
        errors: [{ fieldName: string; message: string; kind: string }];
      }
    ).toEqual({ message: "Email address already in use" });
  });

  it("success case - no user with the same email exists", async () => {
    const email = "hotdog@pizza.com";
    const password = "JamiesonB100";

    const response = await request(app)
      .post("/auth/signup")
      .send({ email, password });

    expect(response.status).toBe(StatusCode.OK);

    const user = await userDatabase.getUserByEmail(email);
    expect(user.email).toBe(email);
  });
});

describe("Login", () => {
  it("error case - missing request body", async () => {
    const response = await request(app).post("/auth/login");

    expect(response.status).toBe(StatusCode.BAD_REQUEST);
    expect(response.body).toEqual({
      message: "Invalid email address, Password cannot be empty",
    });
  });

  it("error case - missing email", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ password: "asdfdsa" });

    expect(response.status).toBe(StatusCode.BAD_REQUEST);
    expect(response.body).toEqual({
      message: "Invalid email address",
    });
  });

  it("error case: email is not valid", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: "yoloswaggins", password: "cookiemonster" });

    expect(response.status).toBe(StatusCode.BAD_REQUEST);
    expect(response.body).toEqual({
      message: "Invalid email address",
    });
  });

  it("error case - missing password", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: "yoloswaggins@hotdog.com" });

    expect(response.status).toBe(StatusCode.BAD_REQUEST);
    expect(response.body).toEqual({
      message: "Password cannot be empty",
    });
  });

  it("error case - no such user exists", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: "tatertots@pizza.com", password: "eskimos" });

    expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    expect(response.body).toEqual({
      message: "Invalid Credentials",
    });
  });

  it("error case - user exists, but password is incorrect", async () => {
    const email = "pizza@hotdog.com";
    const actualPassword = "SlimJim";
    const wrongPassword = "Rabbit";
    await userDatabase.createUser(email, actualPassword);

    const response = await request(app)
      .post("/auth/login")
      .send({ email, password: wrongPassword });

    expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    expect(response.body).toEqual({
      message: "Invalid Credentials",
    });
  });

  it("success case", async () => {
    const email = "Rick@shaw.ca";
    const password = "KFC";
    const createdUser = await authHandler.signup(email, password);

    const response = await request(app)
      .post("/auth/login")
      .send({ email, password });

    expect(response.status).toBe(StatusCode.OK);

    const token = response.body.token;

    const decodedToken = jwt.verify(token, BACKUP_JWT_SECRET);
    if (typeof decodedToken === "string") {
      throw new Error("Unexpected string payload");
    }

    interface CustomJwtPayload {
      subject: string;
      email: string;
    }

    const customPayload: CustomJwtPayload = {
      subject: (decodedToken as CustomJwtPayload).subject,
      email: (decodedToken as CustomJwtPayload).email,
    };

    expect(customPayload).toEqual({
      subject: createdUser.id,
      email: email,
    });
    expect(response.body).toEqual({
      id: createdUser.id,
      token,
    });
  });
});