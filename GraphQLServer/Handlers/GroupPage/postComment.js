/* eslint-disable camelcase */
const Users = require('../../ModelsMongoDB/Users');
const Expenses = require('../../ModelsMongoDB/Expenses');

async function handle_request(message, callback) {
  const expense = await Expenses.findOne({ _id: message.expenseId });
  const user = await Users.findOne({ _id: message.userId });
  const data = {
    userName: user.name,
    commentDetails: message.comment,
    commentDate: new Date(),
  };
  expense.comments.push(data);
  await expense.save();
  callback(null, 200);
}

exports.handle_request = handle_request;
