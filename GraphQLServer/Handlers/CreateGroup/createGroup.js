/* eslint-disable no-underscore-dangle */
const Users = require('../../ModelsMongoDB/Users');
const Groups = require('../../ModelsMongoDB/Groups');

async function createGroup(userId, memberEmails, groupName) {
  const existingGroup = await Groups.findOne({ name: groupName });
  if (existingGroup === null) {
    const creatorUser = await Users.findOne({ _id: userId });
    const otherUsers = await Users.find({ email: memberEmails });
    const newGroupModel = new Groups({
      name: groupName,
      creatorId: creatorUser._id,
    });
    newGroupModel.groupMembers.push(creatorUser._id);
    const newGroup = await newGroupModel.save();
    creatorUser.joinedGroups.push(newGroup._id);
    creatorUser.save();
    otherUsers.forEach((otherUser) => {
      otherUser.invitedGroups.push(newGroup._id);
      otherUser.save();
    });
    return '200';
  } else {
    return '400';
  }
}

exports.createGroup = createGroup;
