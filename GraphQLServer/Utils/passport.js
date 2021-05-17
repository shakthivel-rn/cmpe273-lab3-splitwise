const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const { secret } = require('./config');
const Users = require('../ModelsMongoDB/Users');

// Setup work and export for the JWT passport strategy
function auth() {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: secret,
  };
  passport.use(
    new JwtStrategy(opts, (jwtPayload, callback) => {
      const { _id } = jwtPayload;
      Users.findById(_id, (err, results) => {
        if (err) {
          return callback(err, false);
        }
        if (results) {
          return callback(null, results);
        }
        return callback(null, false);
      });
    }),
  );
}

exports.auth = auth;
exports.checkAuth = passport.authenticate('jwt', { session: false });
