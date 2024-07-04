import { NextFunction, Request, Response } from "express";
import AuthHandler from "../handlers/AuthHandler";
import StatusCode from "../utils/StatusCode";
import UserDatabase from "../database/users/UserDatabase";
import BaseRouter from "./BaseRouter";
import { handleValidationErrors, validateCredentials } from "../utils/middleware";

const asyncWrapper = (
  operation: (
    request: Request,
    response: Response,
    next: NextFunction
  ) => Promise<any>
) => {
  return (request: Request, response: Response, next: NextFunction) => {
    Promise.resolve(operation(request, response, next)).catch(next);
  };
};

class AuthRouter extends BaseRouter {
  private authHandler: AuthHandler;

  constructor(userDatabase: UserDatabase) {
    super();
    this.authHandler = new AuthHandler(userDatabase);
  }

  initializeRoutes() {
    this.router.post("/signup", validateCredentials, handleValidationErrors, asyncWrapper(this.signup.bind(this)));
    this.router.post("/login", validateCredentials, handleValidationErrors, asyncWrapper(this.login.bind(this)));
  }

  private async signup(request: Request, response: Response) {
    const { email, password } = request.body;

    await this.authHandler.signup(email, password);
    response.status(StatusCode.OK).send();
  }

  private async login(request: Request, response: Response) {
    const { email, password } = request.body;

    const { id, token } = await this.authHandler.login(email, password);
    response.status(StatusCode.OK).json({ id, token });
  }
}

export default AuthRouter;
