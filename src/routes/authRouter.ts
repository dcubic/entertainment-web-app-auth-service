import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import AuthHandler from "../handlers/AuthHandler";
import StatusCodes from "../utils/StatusCodes";

const router = express.Router();
const authHandler = new AuthHandler();

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("Password cannot be empty"),
  ],
  (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    const { email, password } = request.body;

    authHandler
      .signup(email, password)
      .then((_) => {
        response.status(StatusCodes.OK).send();
      })
      .catch((error) => {
        response.status(error.status).json({ message: error.message });
      });
  }
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("Password cannot be empty"),
  ],
  (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    const { email, password } = request.body;

    authHandler
      .signup(email, password)
      .then((_) => {
        response.status(StatusCodes.OK).send();
      })
      .catch((error) => {
        response.status(error.status).json({ message: error.message });
      });
  }
);

export default router;
