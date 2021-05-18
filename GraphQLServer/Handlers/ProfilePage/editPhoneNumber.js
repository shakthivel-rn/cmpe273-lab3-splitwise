const Users = require('../../ModelsMongoDB/Users');

async function editPhoneNumber(userId, phone) {
  const user = await Users.findOne({ _id: userId });
  user.phoneNumber = phone;
  user.save();
  return '200';
}

exports.editPhoneNumber = editPhoneNumber;
