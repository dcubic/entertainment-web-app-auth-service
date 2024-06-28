import jwt from "jsonwebtoken";
import UserDatabase from '../database/users/UserDatabase'
import { hash, verifyHashSource } from "../utils/hash";
import StatusCodes from '../utils/StatusCodes';

const JWT_SECRET = "PIZZA"; // TODO 

class AuthHandler {
  private userDatabase: UserDatabase
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
    const didPasswordProduceHash = verifyHashSource(password, user.password)
    if (!didPasswordProduceHash) {
      throw {
        status: StatusCodes.UNAUTHORIZED,
        message: "Invalid User credentials"
      }
    }
    
    const token = jwt.sign(
      { subject: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    return token;
  }
}

export default AuthHandler;
