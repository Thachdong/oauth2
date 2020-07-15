require("dotenv").config();
require("./configs/passport");
const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const authRoutes = require("./routes/auth");

const app = express();

//Connect to mongodb
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongodb connected"))
  .catch(() => console.log("Mongodb connection fail"));
//Set view engine
app.set("view engine", "ejs");
//Top middlewares
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/auth", authRoutes);
const checkAuth = (req, res, next) => {
  req.user ? next() : res.redirect("/login");
};
app.get("/login", (req, res) => {
  req.user && res.redirect("/dashboard");
  res.render("index", { user: req.user });
});
app.get("/logout", checkAuth, (req, res) => {
  req.logOut();
  res.redirect("/");
});
app.get("/", checkAuth, (req, res) => {
  res.redirect("/dashboard");
});
app.get("/dashboard", checkAuth, (req, res) => {
  res.render("dashboard", { user: req.user });
  // res.send(req.user);
});
//App listent
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
