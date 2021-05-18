/* eslint-disable camelcase */
const Transactions = require('../../ModelsMongoDB/Transactions');

async function settleAmount(userId, friendId) {
  const transactions = await Transactions
    .find({ owedUserId: userId, paidUserId: friendId });
  transactions.forEach((transaction) => {
    const newTransaction = transaction;
    newTransaction.paymentStatus = true;
    newTransaction.time = Date.now();
    newTransaction.save();
  });
  return '200';
}

exports.settleAmount = settleAmount;
