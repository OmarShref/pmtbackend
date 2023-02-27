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

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
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
const userRoute = require("./routes/userRouter");
app.use("/", userRoute);

// listen to the port
app.listen(port);
console.log(`working on http://localhost:${port}/`);
