const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const passport = require("passport");
const { Strategy } = require("passport-http-bearer");

passport.use(
  new Strategy((token, done) => {
    console.log(token)
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        if (
          err.name === "JsonWebTokenError" &&
          err.name === "TokenExpiredError"
        )
          done(null, false);
        done(err);
        return;
      }
      done(null, decoded);
    });
  })
);

module.exports = passport;
