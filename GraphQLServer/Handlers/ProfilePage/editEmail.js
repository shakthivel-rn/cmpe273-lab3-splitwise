const Users = require('../../ModelsMongoDB/Users');

async function handle_request(message, callback) {
  let status = 400;
  const user = await Users.findOne({ _id: message.userId });
  try {
    user.email = message.email;
    await user.save();
    status = 200;
  } catch {
    status = 400;
  } finally {
    callback(null, status);
  }
}

exports.handle_request = handle_request;
