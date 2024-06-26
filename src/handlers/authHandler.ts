import bcrypt from "bcrypt";
import AuthClient from "../clients/AuthClient";

class AuthHandler {
  constructor(private authClient: AuthClient = new AuthClient()) {}

  async signup(email: string, password: string) {
    const createdUser = await this.authClient.createUser(
      email,
      await this.hashPassword(password)
    );
    return createdUser;
  }

  async login(email: string, password: string) {
    const user = await this.authClient.verify(
      email,
      await this.hashPassword(password)
    );
    return user;
  }

  private async hashPassword(password: string) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
  }
}

export default AuthHandler;
