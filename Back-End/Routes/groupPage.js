/* eslint-disable no-underscore-dangle */
const express = require('express');
const Users = require('../ModelsMongoDB/Users');
const Groups = require('../ModelsMongoDB/Groups');
const Expenses = require('../ModelsMongoDB/Expenses');
const Transactions = require('../ModelsMongoDB/Transactions');
const { checkAuth } = require('../Utils/passport');

const router = express.Router();

router.get('/', async (req, res) => {
  const transactions = await Transactions.find({ groupName: req.query.groupName },
    { expenseId: 1, expenseDescription: 1 }).sort({ time: 'desc' });
  const result = transactions.map((transaction) => ({
    expenseId: transaction.expenseId,
    expenseDescription: transaction.expenseDescription,
  }));
  const uniq = new Set(result.map((e) => JSON.stringify(e)));
  const uniqueResult = Array.from(uniq).map((e) => JSON.parse(e));
  res.send(uniqueResult);
});

router.get('/getExpenseDetail', async (req, res) => {
  const allUsers = await Users.find({});
  const allUsersNames = {};
  allUsers.forEach((allUser) => {
    allUsersNames[allUser._id] = allUser.name;
  });
  const user = await Users.findOne({ _id: req.query.userId });
  const groupTransactions = await Transactions
    .find({ groupName: req.query.groupName, expenseId: req.query.expenseId });
  const result = groupTransactions.map((groupTransaction) => {
    if (groupTransaction.paidUserId.equals(groupTransaction.owedUserId)
        && groupTransaction.paidUserId.equals(user._id)) {
      return ({
        expenseName: groupTransaction.expenseDescription,
        expenseAmount: groupTransaction.expenseAmount,
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
        paidUserName: allUsersNames[groupTransaction.paidUserId],
        owedUserName: 'You',
        splitAmount: groupTransaction.splitAmount,
        status: 'owes',
      });
    }

    return ({
      expenseName: groupTransaction.expenseDescription,
      expenseAmount: groupTransaction.expenseAmount,
      paidUserName: allUsersNames[groupTransaction.paidUserId],
      owedUserName: allUsersNames[groupTransaction.owedUserId],
      splitAmount: groupTransaction.splitAmount,
      status: 'owes',
    });
  });
  res.send(result);
});

router.post('/postComment', checkAuth, async (req, res) => {
  const expense = await Expenses.findOne({ _id: req.body.expenseId });
  const user = await Users.findOne({ _id: req.body.userId });
  const data = {
    userName: user.name,
    commentDetails: req.body.comment,
    commentDate: new Date(),
  };
  expense.comments.push(data);
  await expense.save();
  res.send();
});

router.get('/getComments', checkAuth, async (req, res) => {
  const user = await Users.findOne({ _id: req.query.userId });
  const expense = await Expenses.findOne({ _id: req.query.expenseId });
  const result = expense.comments.map((comment) => {
    if (comment.userName === user.name) {
      return (
        {
          expenseId: expense._id,
          userName: 'You',
          commentDetails: comment.commentDetails,
          commentDate: comment.commentDate,
        }
      );
    }
    return ({
      expenseId: expense._id,
      userName: comment.userName,
      commentDetails: comment.commentDetails,
      commentDate: comment.commentDate,
    });
  });
  res.send(result);
});

router.post('/deleteComment', checkAuth, async (req, res) => {
  const expense = await Expenses.findOne({ _id: req.body.expenseId });
  expense.comments.splice(req.body.commentIndex, 1);
  await expense.save();
  res.send();
});

router.get('/getImage', async (req, res) => {
  const group = await Groups.findOne({ name: req.query.groupName }, { image: 1 });
  res.send(group);
});

module.exports = router;
