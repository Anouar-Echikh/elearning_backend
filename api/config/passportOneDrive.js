const OneDriveTokenStrategy = require("passport-onedrive").Strategy;

const User = require("../models/users.model");

module.exports = passport => {
  // ------start passport facebook --------//

  passport.use(
    "oneDriveToken",
    new OneDriveTokenStrategy(
      {
        callbackURL: "http://localhost/OAuth/oneDrive",
        clientID: process.env.ONEDRIVE_APP_ID,
        clientSecret: process.env.ONEDRIVE_APP_SECRET
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("profile", profile);
          console.log("accessToken", accessToken);
          console.log("refreshToken", refreshToken);
          const foundUser = await User.findOne({
            "onedrive.id": profile.id
          });
          if (foundUser) {
            console.log(foundUser);
            return done(null, foundUser);
          }
          const newUser = new User({
            method: "onedrive",
            onedrive: {
              id: profile.id,

              email: profile.emails[0].value,
              password: "user12369"
            },
            name: profile.displayName,
            img: profile.photos[0].value
          });

          await newUser.save();
          console.log(newUser);
          return done(null, profile);
        } catch (err) {
          return done(err, false, err.message);
        }
      }
    )
  );
  // ------end passport oneDrive --------//
};
