const JwtStrategy = require("passport-jwt").Strategy;
const ExtratJwt = require("passport-jwt").ExtractJwt;

const User = require("../models/users.model");
const jwtFromRequest = ExtratJwt.fromAuthHeaderAsBearerToken();

module.exports = passport => {
  passport.use(
    new JwtStrategy(
      {
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest
      },
      async (jwtPayload, done) => {
        try {
          const foundUser = await User.findById(jwtPayload._id).populate({path:"organization",select:"name",model:"Organization"});
          if (foundUser) {
            console.log(foundUser);
            return done(null, foundUser);
          }
          return done(null, false);
        } catch (e) {
          return done(e, false);
        }
      }
    )
  );
};
