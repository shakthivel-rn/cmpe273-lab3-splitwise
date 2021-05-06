const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('../Utils/config');
const Users = require('../ModelsMongoDB/Users');
const { auth } = require('../Utils/passport');

const router = express.Router();

auth();

router.post('/', async (req, res) => {
  const doc = await Users.findOne({ email: req.body.email });
  if (doc !== null) {
    bcrypt.compare(req.body.password, doc.password, (err, isMatch) => {
      if (isMatch === true) {
        req.session.user = doc;
        const { _id, name } = doc;
        const payload = { _id, name };
        const token = jwt.sign(payload, secret, {
          expiresIn: 1008000,
        });
        res.status(200).send(`JWT ${token}`);
      } else {
        res.sendStatus(401);
      }
    });
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
