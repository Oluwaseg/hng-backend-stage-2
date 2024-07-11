var createError = require("http-errors");
var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var authRouter = require("./routes/auth");
var apiRouter = require("./routes/api");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to HNG INTERNSHIP BACKEND TASK");
});

app.use("/auth", authRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  const response = {
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  };

  // Respond with JSON
  res.status(err.status || 500).json(response);
});

module.exports = app;
