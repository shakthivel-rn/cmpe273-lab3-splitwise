/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const Users = require('../../ModelsMongoDB/Users');
const Groups = require('../../ModelsMongoDB/Groups');
const Expenses = require('../../ModelsMongoDB/Expenses');
const Transactions = require('../../ModelsMongoDB/Transactions');

async function createExpense(userId, groupId, expenseDescription, expenseAmount) {
  const creatorUser = await Users.findOne({ _id: userId });
  const group = await Groups.findOne({ _id: groupId });
  const otherUsers = await Users.find({ _id: group.groupMembers });
  if (group.groupMembers.length > 1) {
    const expenseModel = new Expenses({
      groupName: group.name,
      expenseDescription: expenseDescription,
      expenseAmount: expenseAmount,
    });
    const expense = await expenseModel.save();
    const transactions = group.groupMembers.map((groupMember) => {
      if (groupMember.equals(creatorUser._id)) {
        const transactionModel = new Transactions({
          groupName: group.name,
          expenseId: expense._id,
          expenseDescription: expenseDescription,
          expenseAmount: expenseAmount,
          paidUserId: creatorUser._id,
          owedUserId: groupMember._id,
          splitAmount: (expenseAmount / group.groupMembers.length).toFixed(2),
          paymentStatus: true,
        });
        return transactionModel;
      }
      const transactionModel = new Transactions({
        groupName: group.name,
        expenseId: expense._id,
        expenseDescription: expenseDescription,
        expenseAmount: expenseAmount,
        paidUserId: creatorUser._id,
        owedUserId: groupMember._id,
        splitAmount: (expenseAmount / group.groupMembers.length).toFixed(2),
        paymentStatus: false,
      });
      return transactionModel;
    });
    const allTransactions = await Transactions.insertMany(transactions);
    const transactionIds = allTransactions.map((allTransaction) => allTransaction._id);
    group.groupTransactions = [...group.groupTransactions, ...transactionIds];
    group.save();
    otherUsers.forEach((otherUser) => {
      const newOtherUser = otherUser;
      newOtherUser.transactions.push.apply(otherUser.transactions, transactionIds);
      newOtherUser.save();
    });
    return '200';
  } else {
    return '401';
  }
}

exports.createExpense = createExpense;
