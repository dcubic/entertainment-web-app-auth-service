import { Request, Response } from "express";
import BaseRouter from "./BaseRouter";
import StatusCode from "../utils/StatusCode";

class AuthRouter extends BaseRouter {
  constructor() {
    super();
  }

  initializeRoutes() {
    this.router.get("/health", this.healthCheck.bind(this));
  }

  private healthCheck(request: Request, response: Response) {
    response.status(StatusCode.OK).send();
  }
}

export default AuthRouter;
