const Groups = require('../../ModelsMongoDB/Groups');

async function handle_request(message, callback) {
  const group = await Groups.findOne({ name: message.groupName }, { image: 1 });
  callback(null, group);
}

exports.handle_request = handle_request;
