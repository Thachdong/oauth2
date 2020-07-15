const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const User = require("../models/user");

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

//Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      const user = await User.findOne({ googleId: profile.id });
      if (user) {
        done(null, user);
      } else {
        const newUser = new User({
          userName: profile.displayName,
          googleId: profile.id,
          oauthProvider: profile.provider,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
        });
        await newUser.save();
        done(null, newUser);
      }
    }
  )
);

//Facebook
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/redirect",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async (request, accessToken, refreshToken, profile, done) => {
      const user = await User.findOne({ facebookId: profile.id });
      if (user) {
        done(null, user);
      } else {
        const newUser = new User({
          userName: profile.displayName,
          facebookId: profile.id,
          oauthProvider: profile.provider,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
        });
        await newUser.save();
        done(null, newUser);
      }
    }
  )
);

//Github
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/redirect",
      scope: "user:email",
    },
    async (request, accessToken, refreshToken, profile, done) => {
      const user = await User.findOne({ githubId: profile.id });
      if (user) {
        done(null, user);
      } else {
        const newUser = new User({
          userName: profile.username,
          githubId: profile.id,
          oauthProvider: profile.provider,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
        });
        await newUser.save();
        done(null, newUser);
      }
    }
  )
);
