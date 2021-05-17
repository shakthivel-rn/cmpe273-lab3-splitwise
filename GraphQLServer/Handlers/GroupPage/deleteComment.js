/* eslint-disable camelcase */
const Expenses = require('../../ModelsMongoDB/Expenses');

async function handle_request(message, callback) {
  const expense = await Expenses.findOne({ _id: message.expenseId });
  expense.comments.splice(message.commentIndex, 1);
  await expense.save();
  callback(null, 200);
}

exports.handle_request = handle_request;
