/* eslint-disable no-unused-vars */
const Users = require('../../ModelsMongoDB/Users');

async function handle_request(message, callback) {
  const memberEmails = await Users.find({}, { email: 1 });
  callback(null, memberEmails);
}

exports.handle_request = handle_request;
