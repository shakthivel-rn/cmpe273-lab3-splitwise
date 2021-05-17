const Users = require('../../ModelsMongoDB/Users');

async function handle_request(message, callback) {
  const user = await Users.findOne({ _id: message.userId });
  user.name = message.name;
  user.save();
  callback(null, 200);
}

exports.handle_request = handle_request;
