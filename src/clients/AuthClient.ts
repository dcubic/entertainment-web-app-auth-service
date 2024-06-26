import { isAxiosError } from 'axios'
import { axiosClient } from "../environment/AxiosClient";
import StatusCodes from "../utils/StatusCodes";


class AuthClient {
  constructor(private httpClient = axiosClient) {}

  async createUser(email: string, password: string) {
    try {
      const response = await this.httpClient.post(
        `${process.env.USER_SERVICE_URL}/users`,
        {
          email,
          password: password,
        }
      );
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
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
  }

  async verify(email: string, password: string) {}
}

export default AuthClient;
