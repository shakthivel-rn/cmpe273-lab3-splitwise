/* eslint-disable camelcase */
const Users = require('../../ModelsMongoDB/Users');
const Groups = require('../../ModelsMongoDB/Groups');

async function getJoinedGroupData(userId) {
  const user = await Users.findOne({ _id: userId });
  const groupIds = user.joinedGroups;
  const memberGroups = await Groups.find({ _id: groupIds }, { name: 1 });
  return memberGroups;
}

exports.getJoinedGroupData = getJoinedGroupData;
