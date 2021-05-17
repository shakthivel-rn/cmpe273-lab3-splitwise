/* eslint-disable camelcase */
const Users = require('../../ModelsMongoDB/Users');
const Groups = require('../../ModelsMongoDB/Groups');

async function handle_request(message, callback) {
  const user = await Users.findOne({ _id: message.userId });
  const groupIds = user.joinedGroups;
  const memberGroups = await Groups.find({ _id: groupIds }, { name: 1 });
  callback(null, memberGroups);
}

exports.handle_request = handle_request;
