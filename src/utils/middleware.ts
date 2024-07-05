import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { InvalidParameterError, ServerError } from "./errors";

export const validateCredentials = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password cannot be empty"),
];

export const handleValidationErrors = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    throw new InvalidParameterError(
      errors
        .array()
        .map((error) => error.msg)
        .join(", ")
    );
  }
  next();
};

export const handleErrors = (
  error: ServerError,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  response.status(error.statusCode).json({ message: error.message });
};
