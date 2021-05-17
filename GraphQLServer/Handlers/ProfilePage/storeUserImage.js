const Users = require('../../ModelsMongoDB/Users');

async function handle_request(message, callback) {
  const user = await Users.findOne({ _id: message.userId });
  user.userImage = message.fileLocation;
  user.save();
  callback(null, 200);
}

exports.handle_request = handle_request;
