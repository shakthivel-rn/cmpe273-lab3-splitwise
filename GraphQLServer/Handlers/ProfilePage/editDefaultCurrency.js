const Users = require('../../ModelsMongoDB/Users');

async function editDefaultCurrency(userId, defaultcurrency) {
  const user = await Users.findOne({ _id: userId });
  user.defaultCurrency = defaultcurrency;
  user.save();
  return '200';
}

exports.editDefaultCurrency = editDefaultCurrency;
