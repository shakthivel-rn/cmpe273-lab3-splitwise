/* eslint-disable no-underscore-dangle */
const express = require('express');
const Users = require('../ModelsMongoDB/Users');
const Groups = require('../ModelsMongoDB/Groups');
const Transactions = require('../ModelsMongoDB/Transactions');
const { checkAuth } = require('../Utils/passport');

const router = express.Router();

router.get('/', async (req, res) => {
  const allUsers = await Users.find({});
  const allUsersNames = {};
  allUsers.forEach((allUser) => {
    allUsersNames[allUser._id] = allUser.name;
  });
  const user = await Users.findOne({ _id: req.query.userId });
  const groupIds = user.joinedGroups;
  const memberGroups = await Groups.find({ _id: groupIds });
  const memberGroupsNames = memberGroups.map((memberGroup) => memberGroup.name);
  const { order, selectedGroup } = req.query;
  console.log(req.query);
  let groupTransactions = [];
  if (order === 'asc' && selectedGroup === 'All') {
    groupTransactions = await Transactions.find({ groupName: memberGroupsNames }).sort({ time: 1 });
  } else if (order === 'asc') {
    groupTransactions = await Transactions.find({ groupName: selectedGroup }).sort({ time: 1 });
  } else if (order === 'desc' && selectedGroup === 'All') {
    groupTransactions = await Transactions.find({ groupName: memberGroupsNames }).sort({ time: 'desc' });
  } else {
    groupTransactions = await Transactions.find({ groupName: selectedGroup }).sort({ time: 'desc' });
  }
  const result = groupTransactions.map((groupTransaction) => {
    if (groupTransaction.paidUserId.equals(groupTransaction.owedUserId)
      && groupTransaction.paidUserId.equals(user._id)) {
      return ({
        expenseName: groupTransaction.expenseDescription,
        expenseAmount: groupTransaction.expenseAmount,
        groupName: groupTransaction.groupName,
        paidUserName: 'You',
        owedUserName: 'You',
        splitAmount: groupTransaction.splitAmount,
        status: 'added',
      });
    }

    if (groupTransaction.paidUserId.equals(groupTransaction.owedUserId)) {
      return ({
        expenseName: groupTransaction.expenseDescription,
        expenseAmount: groupTransaction.expenseAmount,
        groupName: groupTransaction.groupName,
        paidUserName: allUsersNames[groupTransaction.paidUserId],
        owedUserName: allUsersNames[groupTransaction.owedUserId],
        splitAmount: groupTransaction.splitAmount,
        status: 'added',
      });
    }

    if (groupTransaction.paymentStatus === true
      && groupTransaction.paidUserId.equals(user._id)) {
      return ({
        expenseName: groupTransaction.expenseDescription,
        expenseAmount: groupTransaction.expenseAmount,
        groupName: groupTransaction.groupName,
        paidUserName: 'You',
        owedUserName: allUsersNames[groupTransaction.owedUserId],
        splitAmount: groupTransaction.splitAmount,
        status: 'paid',
      });
    }

    if (groupTransaction.paymentStatus === true
      && groupTransaction.owedUserId.equals(user._id)) {
      return ({
        expenseName: groupTransaction.expenseDescription,
        expenseAmount: groupTransaction.expenseAmount,
        groupName: groupTransaction.groupName,
        paidUserName: allUsersNames[groupTransaction.paidUserId],
        owedUserName: 'You',
        splitAmount: groupTransaction.splitAmount,
        status: 'paid',
      });
    }

    if (groupTransaction.paymentStatus === true) {
      return ({
        expenseName: groupTransaction.expenseDescription,
        expenseAmount: groupTransaction.expenseAmount,
        groupName: groupTransaction.groupName,
        paidUserName: allUsersNames[groupTransaction.paidUserId],
        owedUserName: allUsersNames[groupTransaction.owedUserId],
        splitAmount: groupTransaction.splitAmount,
        status: 'paid',
      });
    }

    if (groupTransaction.paidUserId.equals(user._id)) {
      return ({
        expenseName: groupTransaction.expenseDescription,
        expenseAmount: groupTransaction.expenseAmount,
        groupName: groupTransaction.groupName,
        paidUserName: 'You',
        owedUserName: allUsersNames[groupTransaction.owedUserId],
        splitAmount: groupTransaction.splitAmount,
        status: 'owes',
      });
    }

    if (groupTransaction.owedUserId.equals(user._id)) {
      return ({
        expenseName: groupTransaction.expenseDescription,
        expenseAmount: groupTransaction.expenseAmount,
        groupName: groupTransaction.groupName,
        paidUserName: allUsersNames[groupTransaction.paidUserId],
        owedUserName: 'You',
        splitAmount: groupTransaction.splitAmount,
        status: 'owes',
      });
    }

    return ({
      expenseName: groupTransaction.expenseDescription,
      expenseAmount: groupTransaction.expenseAmount,
      groupName: groupTransaction.groupName,
      paidUserName: allUsersNames[groupTransaction.paidUserId],
      owedUserName: allUsersNames[groupTransaction.owedUserId],
      splitAmount: groupTransaction.splitAmount,
      status: 'owes',
    });
  });
  const { pageNumber, pageSize } = req.query;
  const lastIndex = pageNumber * pageSize;
  const firstIndex = lastIndex - pageSize;
  const paginatedResult = result.slice(firstIndex, lastIndex);
  console.log(paginatedResult);
  res.send(paginatedResult);
});

router.get('/getPaginationNumbers', checkAuth, async (req, res) => {
  const user = await Users.findOne({ _id: req.query.userId });
  const groupIds = user.joinedGroups;
  const memberGroups = await Groups.find({ _id: groupIds });
  const memberGroupsNames = memberGroups.map((memberGroup) => memberGroup.name);
  const { selectedGroup } = req.query;
  let groupTransactions = [];
  if (selectedGroup === 'All') {
    groupTransactions = await Transactions.find({ groupName: memberGroupsNames }).sort({ time: 'desc' });
  } else {
    groupTransactions = await Transactions.find({ groupName: selectedGroup }).sort({ time: 'desc' });
  }
  const { pageSize } = req.query;
  const paginationNumber = (groupTransactions.length / pageSize);
  res.send({ paginationNumber: Math.ceil(paginationNumber) });
});

module.exports = router;
