/* eslint-disable camelcase */
const Users = require('../../ModelsMongoDB/Users');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { secret } = require('../../Utils/config');
const { auth } = require('../../Utils/passport');

auth();

async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });
  return hashedPassword;
}

async function singUp(name, email, password) {
  let token = {};
  password = await hashPassword(password);
  const newUser = new Users({
    name: name,
    email: email,
    password: password,
  });
  try {
    const doc = await newUser.save();
    const { _id, name } = doc;
    const payload = { _id, name };
    token = jwt.sign(payload, secret, {
      expiresIn: 1008000,
    });
    return `JWT ${token}`
  } catch (e) {
   return '400';
  }
}

exports.singUp = singUp;
