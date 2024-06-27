import AuthHandler from "../../src/handlers/AuthHandler";
import { hash } from "crypto";

let authHandler: AuthHandler;

beforeEach(() => {  });

describe("Sign Up", () => {
  it("error case - a user already exists with the specified email", async () => {
    const email = "pizza@lunch.com";
    const password = "password-potato";
    const hashedPassword = await hashPassword(password);

    const alternatePassword = password + 'asdf'
    try {
      const response = await authHandler.signup(email, await hashPassword(alternatePassword));
      console.log(response);
      expect(true).toBe(false); // this shouldn't happen
    } catch(error) {
      console.log("error: ", error);
      expect(error).toEqual({
        status: 409,
        message: "A User with the specified email address already exists",
      });
    }
  });

  it("success case - no user with the same email exists", async () => {
    const alternateEmails = ["ABC@potato.com", "DEF@lunchables.net"];
    const password = "ABCDEFGHI123";
    const hashedPassword = await hashPassword(password);

    for (const email of alternateEmails) {
      mockedUserService.createUser(email, hashedPassword);
    }

    const email = "SLIMMY_JIMMY@hotdog.com";
    const signupResult = await authHandler.signup(email, password);
    console.log("users: ", mockedUserService.users);
    expect(signupResult).toEqual({
      id: mockedUserService.getIdForUserWithEmail(email),
      email: email,
    });
  });
});

// describe("Login", () => {
//   it("error case - no such user exists with the specified credentials", async () => {
//     const email = "gandalf@middleearth.com";
//     const password = "eru";
//     const otherCredentials = [
//       { email: "pizza@pencil.com", password: password },
//       { email: email, password: "fdsad2" },
//     ];
//     for (const credentials of otherCredentials) {
//       mockedUserService.createUser(credentials.email, await hashPassword(credentials.password));
//     }

//     const result = await authHandler.login(email, password);
//     expect(result).toBe({ status: 401, message: "Invalid User Credentials" });
//   });

//   it("success care", async () => {
//     const email = "pizza@hamburger.com";
//     const password = "password123";
//     const hashedPassword = await hashPassword(password)
//     mockedUserService.createUser(email, hashedPassword);

//     const result = await authHandler.login(email, password);

//     expect(result).toBe({ status: 200 });
//   });
// });
