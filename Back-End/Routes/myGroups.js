/* eslint-disable no-underscore-dangle */
const express = require('express');
const Users = require('../ModelsMongoDB/Users');
const Groups = require('../ModelsMongoDB/Groups');
const Transactions = require('../ModelsMongoDB/Transactions');
const { checkAuth } = require('../Utils/passport');

const router = express.Router();

router.get('/', checkAuth, async (req, res) => {
  const allUsers = await Users.find({});
  const allUsersNames = {};
  allUsers.forEach((allUser) => {
    allUsersNames[allUser._id] = allUser.name;
  });
  const user = await Users.findOne({ _id: req.query.userId });
  const groupIds = user.invitedGroups;
  const pendingInvites = await Groups.find({ _id: groupIds });
  const inviteDetails = pendingInvites.map((pendingInvite) => ({
    groupId: pendingInvite._id,
    groupName: pendingInvite.name,
    creatorUser: allUsersNames[pendingInvite.creatorId],
    creatorId: pendingInvite.creatorId,
  }
  ));
  res.send(inviteDetails);
});

router.post('/acceptGroupInvite', checkAuth, async (req, res) => {
  const group = await Groups.findOne({ _id: req.body.groupId });
  const user = await Users.findOne({ _id: req.body.userId });
  group.groupMembers.push(user._id);
  await group.save();
  const elementPos = user.invitedGroups.map((x) => x._id).indexOf(req.body.groupId);
  user.joinedGroups.push(user.invitedGroups[elementPos]);
  user.invitedGroups.splice(elementPos, elementPos + 1);
  await user.save();
  res.send();
});

router.post('/leaveGroup', checkAuth, async (req, res) => {
  let status = 401;
  const user = await Users.findOne({ _id: req.body.userId });
  const group = await Groups.findOne({ name: req.body.groupName });
  const groupOwedAmount = await Transactions.aggregate(
    [{
      $match: {
        groupName: req.body.groupName,
        owedUserId: user._id,
        paymentStatus: false,
      },
    },
    {
      $group: {
        _id: null,
        totalOwedAmount: {
          $sum: '$splitAmount',
        },
      },
    },
    ],
  );
  if (groupOwedAmount.length === 0) {
    const elementPos = user.joinedGroups.map((x) => x._id).indexOf(group._id);
    user.joinedGroups.splice(elementPos, 1);
    user.save();
    const groupElementPos = group.groupMembers.map((x) => x._id).indexOf(user._id);
    group.groupMembers.splice(groupElementPos, 1);
    group.save();
    status = 200;
  }
  res.sendStatus(status);
});

module.exports = router;
