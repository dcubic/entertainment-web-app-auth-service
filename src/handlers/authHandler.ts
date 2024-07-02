import jwt from "jsonwebtoken";
import UserDatabase from "../database/users/UserDatabase";
import { hash, verifyHashSource } from "../utils/hash";
import { AuthorizationError } from "../utils/errors";
import { BACKUP_JWT_SECRET } from "../utils/constants";

class AuthHandler {
  private userDatabase: UserDatabase;
  constructor(userDatabase: UserDatabase) {
    this.userDatabase = userDatabase;
  }

  async signup(email: string, password: string) {
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
      throw new AuthorizationError();
    }

    const token = jwt.sign(
      { subject: user.id, email: user.email },
      process.env.JWT_SECRET || BACKUP_JWT_SECRET,
      { expiresIn: "1h" }
    );
    return {
      id: user.id,
      token
    }
  }
}

export default AuthHandler;
