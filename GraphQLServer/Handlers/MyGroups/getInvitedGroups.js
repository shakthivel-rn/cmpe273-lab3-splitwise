/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const Users = require('../../ModelsMongoDB/Users');
const Groups = require('../../ModelsMongoDB/Groups');

async function handle_request(message, callback) {
  const allUsers = await Users.find({});
  const allUsersNames = {};
  allUsers.forEach((allUser) => {
    allUsersNames[allUser._id] = allUser.name;
  });
  const user = await Users.findOne({ _id: message.userId });
  const groupIds = user.invitedGroups;
  const pendingInvites = await Groups.find({ _id: groupIds });
  const inviteDetails = pendingInvites.map((pendingInvite) => ({
    groupId: pendingInvite._id,
    groupName: pendingInvite.name,
    creatorUser: allUsersNames[pendingInvite.creatorId],
    creatorId: pendingInvite.creatorId,
  }
  ));
  callback(null, inviteDetails);
}

exports.handle_request = handle_request;
