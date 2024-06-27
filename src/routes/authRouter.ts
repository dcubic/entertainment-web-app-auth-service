import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import AuthHandler from "../handlers/AuthHandler";
import StatusCodes from "../utils/StatusCodes";
import UserDatabase from "../database/users/UserDatabase";
import BaseRouter from "./BaseRouter";

class AuthRouter extends BaseRouter {
  private authHandler: AuthHandler;

  constructor(userDatabase: UserDatabase) {
    super();
    this.authHandler = new AuthHandler(userDatabase);
  }

  initializeRoutes() {
    this.router.post(
      "/signup",
      [
        body("email").isEmail().withMessage("Invalid email address"),
        body("password").notEmpty().withMessage("Password cannot be empty"),
      ],
      this.signup.bind(this)
    );
    this.router.post(
      "/login",
      [
        body("email").isEmail().withMessage("Invalid email address"),
        body("password").notEmpty().withMessage("Password cannot be empty"),
      ],
      this.login.bind(this)
    );
  }

  private signup(request: Request, response: Response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    const { email, password } = request.body;

    this.authHandler
      .signup(email, password)
      .then((_) => {
        response.status(StatusCodes.OK).send();
      })
      .catch((error) => {
        response.status(error.status).json({ message: error.message });
      });
  }

  private login(request: Request, response: Response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    const { email, password } = request.body;

    this.authHandler
      .login(email, password)
      .then((_) => {
        response.status(StatusCodes.OK).send();
      })
      .catch((error) => {
        response.status(error.status).json({ message: error.message });
      });
  }
}

export default AuthRouter;
