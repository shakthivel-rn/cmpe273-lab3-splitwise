/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const Users = require('../../ModelsMongoDB/Users');
const Groups = require('../../ModelsMongoDB/Groups');

async function acceptGroupInvite(userId, groupId) {
  const group = await Groups.findOne({ _id: groupId });
  const user = await Users.findOne({ _id: userId });
  group.groupMembers.push(user._id);
  await group.save();
  const elementPos = user.invitedGroups.map((x) => x._id).indexOf(groupId);
  user.joinedGroups.push(user.invitedGroups[elementPos]);
  user.invitedGroups.splice(elementPos, elementPos + 1);
  await user.save();
  console.log(user);
  return '200';
}

exports.acceptGroupInvite = acceptGroupInvite;
