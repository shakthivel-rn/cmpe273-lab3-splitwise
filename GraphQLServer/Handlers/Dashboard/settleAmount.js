/* eslint-disable camelcase */
const Transactions = require('../../ModelsMongoDB/Transactions');

async function handle_request(message, callback) {
  const transactions = await Transactions
    .find({ owedUserId: message.userId, paidUserId: message.friendId });
  transactions.forEach((transaction) => {
    const newTransaction = transaction;
    newTransaction.paymentStatus = true;
    newTransaction.time = Date.now();
    newTransaction.save();
  });
  callback(null, 200);
}

exports.handle_request = handle_request;
