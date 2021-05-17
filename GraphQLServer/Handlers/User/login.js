/* eslint-disable camelcase */
const bcrypt = require('bcryptjs');
const Users = require('../../ModelsMongoDB/Users');

async function handle_request(message, callback) {
  const doc = await Users.findOne({ email: message.email });
  if (doc !== null) {
    bcrypt.compare(message.password, doc.password, (err, isMatch) => {
      if (isMatch === true) {
        callback(null, doc);
      } else {
        callback(null, 401);
      }
    });
  } else {
    callback(null, 401);
  }
}

exports.handle_request = handle_request;
