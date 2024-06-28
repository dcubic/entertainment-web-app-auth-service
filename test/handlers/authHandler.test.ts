import jwt from "jsonwebtoken";
import DatabaseConnector from "../../src/database/DatabaseConnector";
import UserDatabase from "../../src/database/users/UserDatabase";
import AuthHandler from "../../src/handlers/AuthHandler";
import {
  AuthorizationError,
  ConflictingResourceError,
} from "../../src/utils/errors";

let databaseConnector: DatabaseConnector;
let authHandler: AuthHandler;
let userDatabase: UserDatabase;

beforeAll(async () => {
  databaseConnector = new DatabaseConnector();
  const connection = await databaseConnector.connect(true);
  userDatabase = new UserDatabase(connection);
  authHandler = new AuthHandler(userDatabase);
});

afterEach(async () => {
  await databaseConnector.clearDatabase();
});

afterAll(async () => {
  await databaseConnector.disconnect();
});

describe("Signup", () => {
  it("error case - a user already exists with the specified email", async () => {
    const email = "pizzapop@hotmail.com";
    const password = "gandalf123";
    await userDatabase.createUser(email, password);

    const newPassword = "asdfdsa";
    await expect(authHandler.signup(email, newPassword)).rejects.toThrow(
      new ConflictingResourceError("Email address already in use")
    );
  });

  it("success case - no user with the same email exists", async () => {
    const email = "hotdog@pizza.com";
    const password = "JamiesonB100";

    const createdUser = await authHandler.signup(email, password);
    const retrievedUser = await userDatabase.getUserByEmail(email);

    expect(createdUser.id).toBe(retrievedUser.id);
  });
});

describe("Login", () => {
  it("error case - no such user exists", async () => {
    const email = "pizzapop@hotmail.com";
    const password = "gandalf123";

    await expect(authHandler.login(email, password)).rejects.toThrow(
      new AuthorizationError()
    );
  });

  it("error case - user exists, but passwords dont match", async () => {
    const email = "pizzapop@hotmail.com";
    const password = "gandalf123";
    await authHandler.signup(email, password);

    const wrongPassword = password + "1234";
    await expect(authHandler.login(email, wrongPassword)).rejects.toThrow(
      new AuthorizationError()
    );
  });

  it("success case", async () => {
    const email = "pizzapop@hotmail.com";
    const password = "gandalf123";
    await authHandler.signup(email, password);
    const createdUser = await userDatabase.getUserByEmail(email);
    const token = await authHandler.login(email, password);

    const decodedToken = await jwt.verify(token, "DOESNT_REALLY_MATTER");
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
  });
});
