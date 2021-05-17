/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const Users = require('../../ModelsMongoDB/Users');
const Groups = require('../../ModelsMongoDB/Groups');

async function handle_request(message, callback) {
  const group = await Groups.findOne({ _id: message.groupId });
  const user = await Users.findOne({ _id: message.userId });
  group.groupMembers.push(user._id);
  await group.save();
  const elementPos = user.invitedGroups.map((x) => x._id).indexOf(message.groupId);
  user.joinedGroups.push(user.invitedGroups[elementPos]);
  user.invitedGroups.splice(elementPos, elementPos + 1);
  await user.save();
  callback(null, 200);
}

exports.handle_request = handle_request;
