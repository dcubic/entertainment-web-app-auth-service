import mongoose from "mongoose";
import DatabaseConnector from "../../src/database/DatabaseConnector";
import UserDatabase from "../../src/database/users/UserDatabase";
import { User, UserModel, getUserModel } from "../../src/database/users/user";
import {
  AuthorizationError,
  ConflictingResourceError,
} from "../../src/utils/errors";

let databaseConnector: DatabaseConnector;
let userDatabase: UserDatabase;
let userModel: UserModel;

beforeAll(async () => {
  databaseConnector = new DatabaseConnector();
  const connection = await databaseConnector.connect(true);
  userModel = getUserModel(connection);
  userDatabase = new UserDatabase(connection);
});

afterEach(async () => {
  await databaseConnector.clearDatabase();
});

afterAll(async () => {
  await databaseConnector.disconnect();
});

describe("createUser", () => {
  it("error case - a user already exists with the specified email", async () => {
    const email = "NORESTRICTIONS";
    const password = "gandalf123";
    const user = new userModel({
        email: email,
        password: password,
      });

    const preExistingUser = await user.save();

    const newPassword = password + "abc";
    await expect(userDatabase.createUser(email, newPassword)).rejects.toThrow(
      new ConflictingResourceError("Email address already in use")
    );

    const allUsers = (await userModel.find({})).map((user) => user);
    expect(allUsers).toHaveLength(1);
    expect(allUsers[0]._id).toStrictEqual(preExistingUser._id)
    expect(allUsers[0].email).toBe(email);
    expect(allUsers[0].password).toBe(password);
  });

  it("success case - no user with the same email exists", async () => {
    const email = "NORESTRICTIONS";
    const password = "PASSWORD";

    const createdUser = await userDatabase.createUser(email, password);
    expect(createdUser.email).toBe(email);

    const allUsers = (await userModel.find({})).map((user) => user);
    expect(allUsers).toHaveLength(1);
    expect(allUsers[0].email).toBe(email);
    expect(allUsers[0].password).toBe(password);
  });
});

describe("getUserByEmail", () => {
  it("error case - no such user exists", async () => {
    const email = "pizzapop@hotmail.com";
    await expect(userDatabase.getUserByEmail(email)).rejects.toThrow(
      new AuthorizationError()
    );
  });

  it("success case", async () => {
    const email = "pizzapop@hotmail.com";
    const password = "gandalf123";
    const createdUser = await userDatabase.createUser(email, password);

    const retrievedUser = await userDatabase.getUserByEmail(email);
    expect(retrievedUser).toEqual({
      id: createdUser.id,
      email,
      password,
    });
  });
});
