const GooglePlusTokenStrategy = require("passport-google-plus-token");
var GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require("../models/users.model");

module.exports = passport => {
  // ------start passport facebook --------//

  // passport.use(
  //   "googleToken",
  //   new GooglePlusTokenStrategy(
  //     {
  //       //callbackURL: "http:/OAuth/facebook/callback",
  //       clientID: process.env.GOOGLE_CLIENT_ID,
  //       clientSecret: process.env.GOOGLE_CLIENT_SECRET
  //     },
  passport.use(
    "googleToken",
    new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //callbackURL: "http://www.example.com/auth/google/callback"
  },

      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("profile", profile);
          console.log("accessToken", accessToken);
          console.log("refreshToken", refreshToken);
          const foundUser = await User.findOne({
            "google.id": profile.id
          });
          if (foundUser) {
            console.log(foundUser);
            return done(null, foundUser);
          }
          const newUser = new User({
            method: "google",
            google: {
              id: profile.id,

              email: profile.emails[0].value,
              password: "user12369"
            },
            name: profile.displayName,
            img: profile.photos[0].value
          });

          await newUser.save();
          console.log(newUser);
          return done(null, newUser);
        } catch (err) {
          return done(err, false, err.message);
        }
      }
    )
  );
  // ------end passport facebook --------//
};
