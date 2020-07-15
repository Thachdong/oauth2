const router = require("express").Router();
const passport = require("passport");

//Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/dashboard");
});

//Facebook
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/facebook/redirect",
  passport.authenticate("facebook"),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

//Github
router.get("/github", passport.authenticate("github"));
router.get("/github/redirect", passport.authenticate("github"), (req, res) => {
  res.redirect("/dashboard");
});
module.exports = router;
