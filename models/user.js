const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
  },
  googleId: {
    type: String,
  },
  facebookId: {
    type: String,
  },
  twitterId: {
    type: String,
  },
  githubId: {
    type: String,
  },
  oauthProvider: {
    type: String,
  },
  email: {
    type: String,
  },
  avatar: {
    type: String,
  },
});

module.exports = mongoose.model("User", UserSchema);
