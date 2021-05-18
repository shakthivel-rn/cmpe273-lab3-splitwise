const Users = require('../../ModelsMongoDB/Users');

async function editLanguage(userId, language) {
  const user = await Users.findOne({ _id: userId });
  user.language = language;
  user.save();
  return '200';
}

exports.editLanguage = editLanguage;
