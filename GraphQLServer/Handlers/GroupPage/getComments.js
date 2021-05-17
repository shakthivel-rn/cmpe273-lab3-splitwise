/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const Users = require('../../ModelsMongoDB/Users');
const Expenses = require('../../ModelsMongoDB/Expenses');

async function handle_request(message, callback) {
  const user = await Users.findOne({ _id: message.userId });
  const expense = await Expenses.findOne({ _id: message.expenseId });
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
  callback(null, result);
}

exports.handle_request = handle_request;
