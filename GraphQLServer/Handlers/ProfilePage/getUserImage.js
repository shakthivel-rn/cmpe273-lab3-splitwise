const Users = require('../../ModelsMongoDB/Users');

async function handle_request(message, callback) {
  const user = await Users.findOne({ _id: message.userId }, { userImage: 1 });
  callback(null, user);
}

exports.handle_request = handle_request;
