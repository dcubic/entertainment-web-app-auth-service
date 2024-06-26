import AuthHandler from "../../src/handlers/AuthHandler";
import { createAxiosClient } from "../../src/environment/AxiosClient";
import MockedUserService from "../../src/environment/mocks/MockedUserService";

jest.mock("../../src/environment/AxiosClient");

let authHandler: AuthHandler;
let mockedUserService: MockedUserService;

beforeEach(() => {
  createAxiosClient();
  mockedUserService = (createAxiosClient as jest.Mock).mock.results[0].value
    .mockedUserService;
  authHandler = new AuthHandler();
});

describe("Sign Up", () => {
  it("error case - a user already exists with the specified email", async () => {
    const email = "pizza@lunch.com";
    const password = "password-potato";
    mockedUserService.createUser(email, password);

    const result = await authHandler.signup(email, password + "asdf");
    expect(result).toEqual({
      status: 409,
      message: "A User with the specified email address already exists",
    });
  });

  it("success case - no user with the same email exists", async () => {
    const alternateEmails = ["ABC@potato.com", "DEF@lunchables.net"];
    const password = "ABCDEFGHI123";

    for (const email of alternateEmails) {
      mockedUserService.createUser(email, password);
    }

    const email = "SLIMMY_JIMMY@hotdog.com";
    const signupResult = await authHandler.signup(email, password);
    expect(signupResult).toEqual({
        id: mockedUserService.getIdForUserWithCredentials(email, password),
        email: email
    })
  });
});

describe("Login", () => {
  it("error case - no such user exists with the specified credentials", () => {});

  it("success care - success case", () => {});
});
