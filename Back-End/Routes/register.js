const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('../Utils/config');
const Users = require('../ModelsMongoDB/Users');
const { auth } = require('../Utils/passport');

const router = express.Router();

auth();

const encryptionMiddleware = (req, res, next) => {
  bcrypt.genSalt(10, (err1, salt) => {
    bcrypt.hash(req.body.password, salt, (err2, hash) => {
      req.body.password = hash;
      next();
    });
  });
};

const registerUser = async (req, res) => {
  let token = {};
  const newUser = new Users({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    const doc = await newUser.save();
    req.session.user = doc;
    const { _id, name } = doc;
    const payload = { _id, name };
    token = jwt.sign(payload, secret, {
      expiresIn: 1008000,
    });
    res.status(200);
  } catch (e) {
    res.status(400);
  } finally {
    res.send(`JWT ${token}`);
  }
};

router.post('/', encryptionMiddleware, registerUser);

module.exports = router;
