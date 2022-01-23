const express = require("express");
const favicon = require("serve-favicon");
const path = require("path");
const app = express();
const iconPath = path.join(__dirname, "public", "favicon.ico");
const options = { maxAge: 200 * 60 * 60 * 24 * 1000 };
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");

const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");
const plotRoutes = require("./routes/plots");
const plantRoutes = require("./routes/plants");

//Use .env in Config dir.
require("dotenv").config({ path: "./config/.env" });

// Passport Config
require("./config/passport")(passport);

//Connect To Database
connectDB();

//Using EJS for Views
app.set("view engine", "ejs");

//Static Folder
app.use(express.static("public"));
app.use(favicon(iconPath, options));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));

//Use Forms for Put / Delete
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Use Flash Messages for Errors & Info
app.use(flash());

// Setup Routes / Server Listening
app.use("/", mainRoutes);
app.use("/plot", plotRoutes);
app.use("/coll", plotRoutes);
app.use("/plant", plantRoutes);

// Server Running
app.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it!");
});
