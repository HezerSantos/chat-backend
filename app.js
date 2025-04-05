const express = require("express");
const path = require("path");
require("dotenv").config();
const app = express();
// Middleware Imports
const corsMiddleware = require("./middleware/corsMiddleware");
const helmetMiddleware = require("./middleware/helmetMiddleware");
const { passport } = require("./config/passport");
const staticMiddleware = require("./middleware/staticMiddleware");
const cookieParserMiddleware = require("./middleware/cookieParserMiddleware");
const bodyParserMiddleware = require("./middleware/bodyParserMiddleware");
// Apply Middleware
app.use(cookieParserMiddleware);
app.use(bodyParserMiddleware);
app.use(corsMiddleware);
app.use(helmetMiddleware); // Uncomment when needed
app.use(passport.initialize());
app.use(staticMiddleware);
// View Engine Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// Routers
const loginRouter = require("./routes/auth/loginRouter");
const userRouter = require("./routes/users/userRouter");
const refreshRouter = require("./routes/auth/refreshRouter");

// Routes
app.use("/api/auth/login", loginRouter);
app.use("/api/auth/refresh", refreshRouter)
app.use("/api/users", userRouter)
// Logout Route
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token", { 
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    domain: '.up.railway.app',
  });

  console.log("Logged Out")
  res.json({ message: "Logged out successfully" });
});


app.use((err, req, res, next) => {
  console.error(`Error ${err.status}: ${err.message}`)
  res.status(err.status || 500).json({
    errors: err.json,

  });
});


// Server
app.listen(8080, () => {
  console.log("App running on port 8080");
});
