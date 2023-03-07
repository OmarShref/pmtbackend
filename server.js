//  require modules
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");

// starting the app
const app = express();

// creating 24 hours from milliseconds
const oneMonth = 1000 * 60 * 60 * 24 * 30;

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "https://personalmoneytracker.netlify.app",
    credentials: true,
  })
);
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
    cookie: {
      sameSite: "none",
      secure: "auto",
      maxAge: oneMonth,
    },
  })
);
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

// setting the port
const port = process.env.PORT || 7000;

// connect to database
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DB_STRING, {})
  .then(console.log("connected successfully"))
  .catch((err) => console.log(err));

// set the routers
const userRouter = require("./routes/userRouter");
const recordsRouter = require("./routes/recordsRouter");
app.use("/", userRouter);
app.use("/records", recordsRouter);

// listen to the port
app.listen(port);
console.log(`working on http://localhost:${port}/`);
