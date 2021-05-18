/* eslint-disable camelcase */
const bcrypt = require("bcrypt");
const Users = require('../../ModelsMongoDB/Users');
const jwt = require('jsonwebtoken');
const { secret } = require('../../Utils/config');
const { auth } = require('../../Utils/passport');

auth();

async function matchPassword(newPassword, storedEncryptedPassword) {
  console.log("Inside match password");
  console.log(
    "password1" + newPassword + " password2 " + storedEncryptedPassword
  );
  const isSame = await bcrypt.compare(newPassword, storedEncryptedPassword);
  console.log("In matchPassword" + isSame);
  return isSame;
}

async function login(email, password) {
  const doc = await Users.findOne({ email: email });
  if (doc !== null) {
    if (await matchPassword(password, doc.password)) {
      const { _id, name } = doc;
      const payload = { _id, name };
      const token = jwt.sign(payload, secret, {
        expiresIn: 1008000,
      });
      return `JWT ${token}`;
    }
    else {
      return '401';
    }
  } else {
    return '401';
  }
}

exports.login = login;
