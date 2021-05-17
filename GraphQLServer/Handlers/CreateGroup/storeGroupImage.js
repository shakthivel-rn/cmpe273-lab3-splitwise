const Groups = require('../../ModelsMongoDB/Groups');

async function handle_request(message, callback) {
  const group = await Groups.findOne({ name: message.groupName });
  group.image = message.fileLocation;
  group.save();
  callback(null, 200);
}

exports.handle_request = handle_request;
