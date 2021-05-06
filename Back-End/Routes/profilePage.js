const express = require('express');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');
const Users = require('../ModelsMongoDB/Users');
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

router.get('/getUserDetails', checkAuth, async (req, res) => {
  const user = await Users.findOne({ _id: req.query.userId });
  res.send(user);
});

router.put('/editName', checkAuth, async (req, res) => {
  const user = await Users.findOne({ _id: req.body.userId });
  user.name = req.body.name;
  user.save();
  res.send();
});

router.put('/editEmail', checkAuth, async (req, res) => {
  const user = await Users.findOne({ _id: req.body.userId });
  try {
    user.email = req.body.email;
    await user.save();
    res.status(200);
  } catch {
    res.status(400);
  } finally {
    res.send();
  }
});

router.put('/editPhoneNumber', checkAuth, async (req, res) => {
  const user = await Users.findOne({ _id: req.body.userId });
  user.phoneNumber = req.body.phone;
  user.save();
  res.send();
});

router.put('/editDefaultCurrency', checkAuth, async (req, res) => {
  const user = await Users.findOne({ _id: req.body.userId });
  user.defaultCurrency = req.body.defaultcurrency;
  user.save();
  res.send();
});

router.put('/editTimeZone', checkAuth, async (req, res) => {
  const user = await Users.findOne({ _id: req.body.userId });
  user.timezone = req.body.timezone;
  user.save();
  res.send();
});

router.put('/editLanguage', checkAuth, async (req, res) => {
  const user = await Users.findOne({ _id: req.body.userId });
  user.language = req.body.language;
  user.save();
  res.send();
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
  const user = await Users.findOne({ _id: req.body.userId });
  user.userImage = req.body.fileLocation;
  user.save();
  res.sendStatus(200);
});

router.get('/getImage', async (req, res) => {
  const user = await Users.findOne({ _id: req.query.userId }, { userImage: 1 });
  res.send(user);
});

module.exports = router;
