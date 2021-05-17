/* eslint-disable no-underscore-dangle */
const Users = require('../../ModelsMongoDB/Users');
const Groups = require('../../ModelsMongoDB/Groups');

async function handle_request(message, callback) {
  const existingGroup = await Groups.findOne({ name: message.groupName });
  if (existingGroup === null) {
    const creatorUser = await Users.findOne({ _id: message.userId });
    const otherUsers = await Users.find({ email: message.memberEmails });
    const newGroupModel = new Groups({
      name: message.groupName,
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
    callback(null, 200);
  } else {
    callback(null, 400);
  }
}

exports.handle_request = handle_request;
