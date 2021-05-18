const Users = require('../../ModelsMongoDB/Users');

async function editTimeZone(userId, timezone) {
  const user = await Users.findOne({ _id: userId });
  user.timezone = timezone;
  user.save();
  return '200';
}

exports.editTimeZone = editTimeZone;
