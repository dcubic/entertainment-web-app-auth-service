import { getUserModel, User } from "./user";
import mongoose, { Connection } from "mongoose";
import StatusCodes from "../../utils/StatusCodes";

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
        throw {
          status: StatusCodes.CONFLICT,
          errors: Object.entries(error.errors).map(([fieldName, error]) => ({
            fieldName: fieldName,
            message: error.message,
            kind: error.kind,
          })),
        };
      } else {
        throw {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          message: (error as Error).message,
        };
      }
    }
  };

  async getUserByEmail(email: string) {
    try {
      const user = await this.UserModel.findOne({ email: email });
      if (user) return user;
      else {
        throw {
          status: StatusCodes.NOT_FOUND,
          message: `No User with email: \"${email}\" found`,
        };
      }
    } catch (error) {
      throw {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: (error as Error).message,
      };
    }
  }
}

export default UserDatabase;