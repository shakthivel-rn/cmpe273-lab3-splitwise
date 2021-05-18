const Users = require('../../ModelsMongoDB/Users');

async function editName(userId, name) {
  const user = await Users.findOne({ _id: userId });
  user.name = name;
  user.save();
  return '200';
}

exports.editName = editName;
