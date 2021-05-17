const Users = require('../../ModelsMongoDB/Users');

async function handle_request(message, callback) {
  const user = await Users.findOne({ _id: message.userId });
  callback(null, user);
}

exports.handle_request = handle_request;
