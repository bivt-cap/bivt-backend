// Passport (https://www.npmjs.com/package/passport)
// Passport-JWT (https://www.npmjs.com/package/passport-jwt)
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

// Options => Passport
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

// Create the Strategy
module.exports = new JwtStrategy(opts, (jwtPayload, done) => {
  if (jwtPayload.extId !== 'undefined') {
    return done(null, true, jwtPayload.extId);
  }
  return done(null, false);
});
