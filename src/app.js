const express = require("express");
const cors = require("cors");
const compression = require("compression");
const routes = require("./routes");
const { errorConverter, errorHandler } = require("./middlewares/error");
const morgan = require("./config/morgan");
const config = require("./config/config");
const httpStatusCode = require("./utils/httpStatusCode");
const ApiError = require("./utils/ApiError");

const app = express();

if (config.nodeEnv !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

app.use(compression());
app.use(cors());
app.disable("x-powered-by");

app.use("/", routes);

app.use((req, res, next) => {
  next(new ApiError(httpStatusCode.NOT_FOUND, "Not found"));
});

app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
