/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const Users = require('../../ModelsMongoDB/Users');
const Groups = require('../../ModelsMongoDB/Groups');
const Transactions = require('../../ModelsMongoDB/Transactions');

async function handle_request(message, callback) {
  let status = 401;
  const user = await Users.findOne({ _id: message.userId });
  const group = await Groups.findOne({ name: message.groupName });
  const groupOwedAmount = await Transactions.aggregate(
    [{
      $match: {
        groupName: message.groupName,
        owedUserId: user._id,
        paymentStatus: false,
      },
    },
    {
      $group: {
        _id: null,
        totalOwedAmount: {
          $sum: '$splitAmount',
        },
      },
    },
    ],
  );
  if (groupOwedAmount.length === 0) {
    const elementPos = user.joinedGroups.map((x) => x._id).indexOf(group._id);
    user.joinedGroups.splice(elementPos, 1);
    user.save();
    const groupElementPos = group.groupMembers.map((x) => x._id).indexOf(user._id);
    group.groupMembers.splice(groupElementPos, 1);
    group.save();
    status = 200;
  }
  callback(null, status);
}

exports.handle_request = handle_request;
