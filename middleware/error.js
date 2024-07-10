class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequestError";
  }
}

class UnauthenticatedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthenticatedError";
  }
}

const { ValidationError } = require("joi");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let field = null;
  let statusCode = 500;

  if (err instanceof ValidationError) {
    field = err.details[0]?.path[0];
    statusCode = 422;
  } else if (
    err.name === "BadRequestError" ||
    err.name === "UnauthenticatedError"
  ) {
    statusCode = err.name === "UnauthenticatedError" ? 401 : 400;
  }

  const errorResponse = {
    status: err.name,
    message: err.message,
    statusCode,
    error: [{ field: field ?? "general", message: err.name }],
  };

  res.status(statusCode).json(errorResponse);
};

module.exports = {
  BadRequestError,
  UnauthenticatedError,
  errorHandler,
};
