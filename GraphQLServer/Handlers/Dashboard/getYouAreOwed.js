/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const Users = require('../../ModelsMongoDB/Users');
const Transactions = require('../../ModelsMongoDB/Transactions');

async function handle_request(message, callback) {
  const user = await Users.findOne({ _id: message.userId });
  const allUsers = await Users.find({});
  const allUsersNames = {};
  allUsers.forEach((allUser) => {
    allUsersNames[allUser._id] = allUser.name;
  });
  const individualPaidsAmounts = await Transactions.aggregate(
    [{
      $match: {
        paidUserId: user._id,
        paymentStatus: false,
      },
    },
    {
      $group: {
        _id: {
          groupName: '$groupName',
          owedUserId: '$owedUserId',
        },
        total: {
          $sum: '$splitAmount',
        },
      },
    },
    ],
  );
  const result = individualPaidsAmounts.map((individualPaidsAmount) => ({
    groupName: individualPaidsAmount._id.groupName,
    owedUserName: allUsersNames[individualPaidsAmount._id.owedUserId],
    individualPaidAmount: individualPaidsAmount.total,
  }));
  callback(null, result);
}

exports.handle_request = handle_request;
