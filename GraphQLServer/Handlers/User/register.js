/* eslint-disable camelcase */
const Users = require('../../ModelsMongoDB/Users');

async function handle_request(message, callback) {
  let doc = {};
  const newUser = new Users({
    name: message.name,
    email: message.email,
    password: message.password,
  });
  try {
    doc = await newUser.save();
  } catch (e) {
    doc = 400;
  } finally {
    callback(null, doc);
  }
}

exports.handle_request = handle_request;
