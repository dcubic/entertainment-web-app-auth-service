import axios, { AxiosInstance } from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import MockedUserService from "./mocks/MockedUserService";

let mockedUserService: MockedUserService;
const regularAxiosTimeout = 5000;

const createAxiosClient = (): AxiosInstance => {
  if (process.env.NODE_ENV === "test") {
    mockedUserService = new MockedUserService();
    const axiosInstance = axios.create();
    const mockAdapter = new AxiosMockAdapter(axios, { delayResponse: 0 });

    mockAdapter.onPost("/users").reply((config) => {
      const { email, password } = JSON.parse(config.data);

      if (mockedUserService.isEmailInUse(email)) {
        return [
          409,
          { message: "A User with the specified email address already exists" },
        ];
      }

      const createdUser = mockedUserService.createUser(email, password);
      return [201, createdUser];
    });

    mockAdapter.onPost("/verify").reply((config) => {
      const { email, password } = JSON.parse(config.data);

      if (!mockedUserService.verify(email, password)) {
        return [401, { message: "Invalid User Credentials" }];
      }

      return [200];
    });

    return axiosInstance;
  }

  return axios.create({
    baseURL: process.env.USER_SERVICE_URL,
    timeout: regularAxiosTimeout,
  });
};

const axiosClient = createAxiosClient();

export { createAxiosClient, axiosClient };
