/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const Users = require('../../ModelsMongoDB/Users');
const Transactions = require('../../ModelsMongoDB/Transactions');

async function handle_request(message, callback) {
  const user = await Users.findOne({ _id: message.userId });
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
  callback(null, { totalPaidAmount, totalOwedAmount });
}

exports.handle_request = handle_request;
