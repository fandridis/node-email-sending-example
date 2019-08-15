var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var pug = require("pug");
const template = require("./templates/invitation.template");

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey("PLACE_THE_SENDGRID_ACCESS_TOKEN_HERE");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.get("/html", function(req, res) {
  const emailTemplate = template.html("Greece", "fandridis@gmail.com", [
    { location: "Chania Old Town", dates: "01/01/2020 - 01/02/2020" },
    { location: "Thessaloniki", dates: "15/03/2020 - 30/03/2020" },
    { location: "Kastro tis Monemvasias", dates: "20/04/2020 - 27/04/2020" }
  ]);

  const msg = {
    to: "fandridis@gmail.com",
    from: "donotreply@app.com",
    subject: "You have a new travel invite!",
    text: "Please open this email with a browser that accepts html in emails",
    html: emailTemplate
  };

  return sgMail.send(msg);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log("error: ", err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
