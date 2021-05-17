/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const Users = require('../../ModelsMongoDB/Users');
const Transactions = require('../../ModelsMongoDB/Transactions');

async function getYouOweData(userId) {
  const user = await Users.findOne({ _id: userId });
  const allUsers = await Users.find({});
  const allUsersNames = {};
  allUsers.forEach((allUser) => {
    allUsersNames[allUser._id] = allUser.name;
  });
  const individualOwedAmounts = await Transactions.aggregate(
    [{
      $match: {
        owedUserId: user._id,
        paymentStatus: false,
      },
    },
    {
      $group: {
        _id: {
          groupName: '$groupName',
          paidUserId: '$paidUserId',
        },
        total: {
          $sum: '$splitAmount',
        },
      },
    },
    ],
  );
  const result = individualOwedAmounts.map((individualOwedAmount) => ({
    groupName: individualOwedAmount._id.groupName,
    paidUserName: allUsersNames[individualOwedAmount._id.paidUserId],
    individualOwedAmount: individualOwedAmount.total,
  }));
  return result;
}

exports.getYouOweData = getYouOweData;
