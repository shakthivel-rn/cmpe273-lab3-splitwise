/* eslint-disable no-underscore-dangle */
const express = require('express');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');
const Users = require('../ModelsMongoDB/Users');
const Groups = require('../ModelsMongoDB/Groups');
const { checkAuth } = require('../Utils/passport');

const router = express.Router();

const s3 = new aws.S3({
  accessKeyId: 'AKIAJDLWO33APP5O5NSQ',
  secretAccessKey: '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',
  Bucket: 'lab-splitwise-imageupload',
});

function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  }
  return cb('Error: Images Only!');
}

const profileImgUpload = multer({
  storage: multerS3({
    s3,
    bucket: 'lab-splitwise-imageupload',
    acl: 'public-read',
    key(req, file, cb) {
      cb(null, `${path.basename(file.originalname, path.extname(file.originalname))}-${Date.now()}${path.extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
}).single('profileImage');

router.post('/', checkAuth, async (req, res) => {
  const existingGroup = await Groups.findOne({ name: req.body.groupName });
  if (existingGroup === null) {
    const creatorUser = await Users.findOne({ _id: req.body.userId });
    const otherUsers = await Users.find({ email: req.body.memberEmails });
    const newGroupModel = new Groups({
      name: req.body.groupName,
      creatorId: creatorUser._id,
    });
    newGroupModel.groupMembers.push(creatorUser._id);
    const newGroup = await newGroupModel.save();
    creatorUser.joinedGroups.push(newGroup._id);
    creatorUser.save();
    otherUsers.forEach((otherUser) => {
      otherUser.invitedGroups.push(newGroup._id);
      otherUser.save();
    });
    res.status(200);
  } else {
    res.status(400);
  }
  res.send();
});

router.get('/getMemberEmails', checkAuth, async (req, res) => {
  const memberEmails = await Users.find({}, { email: 1 });
  res.send(memberEmails);
});

router.post('/profile-img-upload', (req, res) => {
  profileImgUpload(req, res, (error) => {
    if (error) {
      console.log('errors', error);
      res.json({ error });
    } else if (req.file === undefined) {
      console.log('Error: No File Selected!');
      res.json('Error: No File Selected');
    } else {
      // If Success
      const imageName = req.file.key;
      const imageLocation = req.file.location;
      // Save the file name into database into profile model
      res.json({
        image: imageName,
        location: imageLocation,
      });
    }
  });
});

router.post('/storeImage', async (req, res) => {
  const group = await Groups.findOne({ name: req.body.groupName });
  group.image = req.body.fileLocation;
  group.save();
  res.sendStatus(200);
});

module.exports = router;
