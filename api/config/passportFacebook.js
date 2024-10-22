const FacebookStrategy = require("passport-facebook").Strategy;
const FacebookTokenStrategy = require("passport-facebook-token");

const User = require("../models/users.model");

module.exports = passport => {
  // ------start passport facebook --------//

  passport.use(
    "facebookToken",
    new FacebookTokenStrategy(
      {
        //callbackURL: "http:/OAuth/facebook/callback",
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("profile", profile);
          console.log("accessToken", accessToken);
          console.log("refreshToken", refreshToken);
          const foundUser = await User.findOne({
            "facebook.id": profile.id
          });
          if (foundUser) {
            console.log(foundUser);
            return done(null, foundUser);
          }
          const newUser = new User({
            method: "facebook",
            facebook: {
              id: profile.id,

              email: profile.emails[0].value,
              password: "user12369"
            },
            name: profile.displayName,
            img: profile.photos[0].value,
            role: "customer",
            lastLogin: new Date()
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
