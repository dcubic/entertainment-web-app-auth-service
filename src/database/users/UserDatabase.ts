import { getUserModel, User } from "./user";
import mongoose, { Connection } from "mongoose";
import {
  AuthorizationError,
  ConflictingResourceError,
  InternalServerError,
} from "../../utils/errors";

class UserDatabase {
  private UserModel: mongoose.Model<User>;

  constructor(connection: Connection) {
    this.UserModel = getUserModel(connection);
  }

  createUser = async (email: string, password: string) => {
    try {
      const user = new this.UserModel({
        email: email,
        password: password,
      });

      const createdUser = await user.save();
      return {
        id: createdUser._id.toString(),
        email: createdUser.email,
      };
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new ConflictingResourceError("Email address already in use");
      } else {
        throw new InternalServerError();
      }
    }
  };

  async getUserByEmail(email: string) {
    try {
      const user = await this.UserModel.findOne({ email: email });
      if (user)
        return {
          id: user._id.toString(),
          email: user.email,
          password: user.password,
        };
      else {
        throw new AuthorizationError();
      }
    } catch (error) {
      if (error instanceof AuthorizationError) {
        throw error;
      }
      throw new InternalServerError();
    }
  }
}

export default UserDatabase;
