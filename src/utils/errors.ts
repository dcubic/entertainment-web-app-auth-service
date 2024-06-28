import StatusCode from "./StatusCode";

export class ServerError extends Error {
  readonly statusCode: StatusCode;
  constructor(statusCode: StatusCode, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class InvalidParameterError extends ServerError {
  constructor(
    message: string,
    statusCode: StatusCode = StatusCode.BAD_REQUEST
  ) {
    super(statusCode, message);

    this.name = "InvalidParameterError";
    Object.setPrototypeOf(this, InvalidParameterError.prototype);
  }
}

export class AuthorizationError extends ServerError {
  constructor(
    statusCode: StatusCode = StatusCode.UNAUTHORIZED,
    message: string = "Invalid Credentials"
  ) {
    super(statusCode, message);

    this.name = "AuthorizationError";
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class ConflictingResourceError extends ServerError {
  constructor(
    message: string = "Resource Conflict",
    statusCode: StatusCode = StatusCode.CONFLICT
  ) {
    super(statusCode, message);

    this.name = "ConflictingResourceError";
    Object.setPrototypeOf(this, ConflictingResourceError.prototype);
  }
}

export class InternalServerError extends ServerError {
  constructor(
    statusCode: StatusCode = StatusCode.INTERNAL_SERVER_ERROR,
    message: string = "Something went wrong"
  ) {
    super(statusCode, message);

    this.name = "InternalServerError";
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
