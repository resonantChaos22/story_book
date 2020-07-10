const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");
const morgan = require("morgan"); // THIS IS TO GET A BETTER VIEW OF APIS IN DEVELOPMENT MODE

const connectDB = require("./config/db");

// Load Config
dotenv.config({ path: "./config/config.env" });

// Load Passport Config
require("./config/passport")(passport);

connectDB();

const app = express();

// Logging in Console
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Handlebars
app.engine(".hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

// Sessions
app.use(
  session({
    secret: "storybooks",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware 
app.use(passport.initialize())
app.use(passport.session())

// Static Folder
app.use(express.static(path.join(__dirname, "public")));

//  ROUTES
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
});
