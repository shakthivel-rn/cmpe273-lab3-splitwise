/* eslint-disable camelcase */
const Users = require('../../ModelsMongoDB/Users');
const Transactions = require('../../ModelsMongoDB/Transactions');

async function handle_request(message, callback) {
  const paidUsersIds = await Transactions
    .find({ owedUserId: message.userId, paymentStatus: false }).distinct('paidUserId');
  const paidUsers = await Users.find({ _id: paidUsersIds }, { name: 1 });
  callback(null, paidUsers);
}

exports.handle_request = handle_request;
