const Users = require('../../ModelsMongoDB/Users');

async function getUserDetails(userId) {
  const user = await Users.findOne({ _id: userId });
  return user;
}

exports.getUserDetails = getUserDetails;
