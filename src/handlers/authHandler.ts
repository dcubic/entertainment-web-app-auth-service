import jwt from "jsonwebtoken";
import UserDatabase from "../database/users/UserDatabase";
import { hash, verifyHashSource } from "../utils/hash";
import { AuthorizationError } from "../utils/errors";

const JWT_SECRET = process.env.JWT_SECRET || "";

class AuthHandler {
  private userDatabase: UserDatabase;
  constructor(userDatabase: UserDatabase) {
    this.userDatabase = userDatabase;
  }

  async signup(email: string, password: string) {
    console.log("original password for signup: ", password, "; hashedPassword: ", hash(password));
    const createdUser = await this.userDatabase.createUser(
      email,
      hash(password)
    );

    return createdUser;
  }

  async login(email: string, password: string) {
    const user = await this.userDatabase.getUserByEmail(email);
    const didPasswordProduceHash = verifyHashSource(password, user.password);
    if (!didPasswordProduceHash) {
      console.log("Was the hashing the issue?");
      console.log("password: ", password, "savedPassword: ", user.password);
      throw new AuthorizationError();
    }

    console.log("Secret: ", JWT_SECRET);
    const token = jwt.sign(
      { subject: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    return token;
  }
}

export default AuthHandler;
