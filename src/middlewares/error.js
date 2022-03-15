const config = require("../config/config");
const logger = require("../config/logger");
const ApiError = require("../utils/ApiError");
const httpStatusCode = require("../utils/httpStatusCode");

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || httpStatusCode.INTERNAL_SERVER_ERROR;
    const message = error.message || "Internal server error";
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (config.nodeEnv === "production" && !err.isOperational) {
    statusCode = httpStatusCode.INTERNAL_SERVER_ERROR;
    message = "Internal server error";
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.nodeEnv === "development" && { stack: err.stack }),
  };

  if (config.nodeEnv === "development") {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
