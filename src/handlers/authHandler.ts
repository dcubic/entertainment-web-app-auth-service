import bcrypt from "bcrypt";
import axios from "axios";
import StatusCodes from "../utils/StatusCodes";

export default {
  signup: async (email: string, password: string) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
      const response = await axios.post(
        `${process.env.USER_SERVICE_URL}/users`,
        {
          email,
          password: hashedPassword,
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === StatusCodes.CONFLICT) {
          return {
            status: StatusCodes.CONFLICT,
            message: "A User with the specified email address already exists",
          };
        } else {
          return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "An unexpected Error Occured",
          };
        }
      }

      throw error;
    }
  },
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `${process.env.USER_SERVICE_URL}/users/verify`,
        {
          email,
          password,
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          status: StatusCodes.UNAUTHORIZED,
          message: "Invalid Email/Password combination",
        };
      }

      throw error;
    }
  },
};
