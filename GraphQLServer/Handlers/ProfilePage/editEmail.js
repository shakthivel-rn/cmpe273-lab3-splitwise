const Users = require('../../ModelsMongoDB/Users');

async function editEmail(userId, email) {
  let status = 400;
  const user = await Users.findOne({ _id: userId });
  try {
    user.email = email;
    await user.save();
    status = '200';
  } catch {
    status = '400';
  } finally {
    return status
  }
}

exports.editEmail = editEmail;
