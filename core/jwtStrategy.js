// Passport (https://www.npmjs.com/package/passport)
// Passport-JWT (https://www.npmjs.com/package/passport-jwt)
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

// Configuration
const config = require('./config');

// Business Logic related to the Users
const UserService = require('../services/userService');

// Options => Passport
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.authorization.secret;

// Create the Strategy
module.exports = new JwtStrategy(opts, (jwtPayload, done) => {
  if (jwtPayload.extId !== 'undefined') {
    const sUser = new UserService();
    return new Promise((resolve) => {
      return sUser
        .getUserByExtId(jwtPayload.extId)
        .then((user) => {
          if (!user.isBlocked) {
            return resolve(
              done(null, {
                id: user.id,
                extId: user.extId,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
              })
            );
          } else {
            return resolve(done(null, false));
          }
        })
        .catch(() => {
          return resolve(done(null, false));
        });
    });
  }
  return done(null, false);
});
