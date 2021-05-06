/* eslint-disable no-underscore-dangle */
const express = require('express');
const Users = require('../ModelsMongoDB/Users');
const Groups = require('../ModelsMongoDB/Groups');
const Transactions = require('../ModelsMongoDB/Transactions');

const { checkAuth } = require('../Utils/passport');

const router = express.Router();

router.get('/sample', checkAuth, (req, res) => {
  res.send('You are authorized');
});

router.get('/getGroupNames', checkAuth, async (req, res) => {
  const user = await Users.findOne({ _id: req.query.userId });
  const groupIds = user.joinedGroups;
  const memberGroups = await Groups.find({ _id: groupIds }, { name: 1 });
  res.send(memberGroups);
});

router.get('/getTotalPaidAndOwedAmount', checkAuth, async (req, res) => {
  const user = await Users.findOne({ _id: req.query.userId });
  const transactionIds = user.transactions;
  const transactions = await Transactions.find({ _id: transactionIds });
  let totalPaidAmount = 0;
  let totalOwedAmount = 0;
  transactions.forEach((transaction) => {
    if (transaction.paidUserId.equals(user._id) && transaction.paymentStatus === false) {
      totalPaidAmount += transaction.splitAmount;
    }
  });
  transactions.forEach((transaction) => {
    if (transaction.owedUserId.equals(user._id) && transaction.paymentStatus === false) {
      totalOwedAmount += transaction.splitAmount;
    }
  });
  totalPaidAmount = totalPaidAmount.toFixed(2);
  totalOwedAmount = totalOwedAmount.toFixed(2);
  res.send({ totalPaidAmount, totalOwedAmount });
});

router.get('/getIndividualOwedAmount', checkAuth, async (req, res) => {
  const user = await Users.findOne({ _id: req.query.userId });
  const allUsers = await Users.find({});
  const allUsersNames = {};
  allUsers.forEach((allUser) => {
    allUsersNames[allUser._id] = allUser.name;
  });
  const individualOwedAmounts = await Transactions.aggregate(
    [{
      $match: {
        owedUserId: user._id,
        paymentStatus: false,
      },
    },
    {
      $group: {
        _id: {
          groupName: '$groupName',
          paidUserId: '$paidUserId',
        },
        total: {
          $sum: '$splitAmount',
        },
      },
    },
    ],
  );
  const result = individualOwedAmounts.map((individualOwedAmount) => ({
    groupName: individualOwedAmount._id.groupName,
    paidUserName: allUsersNames[individualOwedAmount._id.paidUserId],
    individualOwedAmount: individualOwedAmount.total,
  }));
  res.send(result);
});

router.get('/getIndividualPaidAmount', checkAuth, async (req, res) => {
  const user = await Users.findOne({ _id: req.query.userId });
  const allUsers = await Users.find({});
  const allUsersNames = {};
  allUsers.forEach((allUser) => {
    allUsersNames[allUser._id] = allUser.name;
  });
  const individualPaidsAmounts = await Transactions.aggregate(
    [{
      $match: {
        paidUserId: user._id,
        paymentStatus: false,
      },
    },
    {
      $group: {
        _id: {
          groupName: '$groupName',
          owedUserId: '$owedUserId',
        },
        total: {
          $sum: '$splitAmount',
        },
      },
    },
    ],
  );
  const result = individualPaidsAmounts.map((individualPaidsAmount) => ({
    groupName: individualPaidsAmount._id.groupName,
    owedUserName: allUsersNames[individualPaidsAmount._id.owedUserId],
    individualPaidAmount: individualPaidsAmount.total,
  }));
  res.send(result);
});

router.get('/getSettleModalDetails', checkAuth, async (req, res) => {
  const paidUsersIds = await Transactions
    .find({ owedUserId: req.query.userId, paymentStatus: false }).distinct('paidUserId');
  const paidUsers = await Users.find({ _id: paidUsersIds }, { name: 1 });
  res.send(paidUsers);
});

router.post('/settleAmount', checkAuth, async (req, res) => {
  const transactions = await Transactions
    .find({ owedUserId: req.body.userId, paidUserId: req.body.friendId });
  transactions.forEach((transaction) => {
    const newTransaction = transaction;
    newTransaction.paymentStatus = true;
    newTransaction.time = Date.now();
    newTransaction.save();
  });
  res.sendStatus(200);
});

module.exports = router;
