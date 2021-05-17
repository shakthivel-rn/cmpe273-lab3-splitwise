/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const Users = require('../../ModelsMongoDB/Users');
const Groups = require('../../ModelsMongoDB/Groups');
const Expenses = require('../../ModelsMongoDB/Expenses');
const Transactions = require('../../ModelsMongoDB/Transactions');

async function handle_request(message, callback) {
  const creatorUser = await Users.findOne({ _id: message.userId });
  const group = await Groups.findOne({ _id: message.groupId });
  const otherUsers = await Users.find({ _id: group.groupMembers });
  if (group.groupMembers.length > 1) {
    const expenseModel = new Expenses({
      groupName: group.name,
      expenseDescription: message.expenseDescription,
      expenseAmount: message.expenseAmount,
    });
    const expense = await expenseModel.save();
    const transactions = group.groupMembers.map((groupMember) => {
      if (groupMember.equals(creatorUser._id)) {
        const transactionModel = new Transactions({
          groupName: group.name,
          expenseId: expense._id,
          expenseDescription: message.expenseDescription,
          expenseAmount: message.expenseAmount,
          paidUserId: creatorUser._id,
          owedUserId: groupMember._id,
          splitAmount: (message.expenseAmount / group.groupMembers.length).toFixed(2),
          paymentStatus: true,
        });
        return transactionModel;
      }
      const transactionModel = new Transactions({
        groupName: group.name,
        expenseId: expense._id,
        expenseDescription: message.expenseDescription,
        expenseAmount: message.expenseAmount,
        paidUserId: creatorUser._id,
        owedUserId: groupMember._id,
        splitAmount: (message.expenseAmount / group.groupMembers.length).toFixed(2),
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
    callback(null, 200);
  } else {
    callback(null, 401);
  }
}

exports.handle_request = handle_request;
