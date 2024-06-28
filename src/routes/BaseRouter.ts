import express, { Router } from "express";

abstract class BaseRouter {
  protected router: Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  abstract initializeRoutes(): void;

  getRouter(): Router {
    return this.router;
  }
}

export default BaseRouter;
