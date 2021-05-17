/* eslint-disable camelcase */
const Users = require('../../ModelsMongoDB/Users');
const Groups = require('../../ModelsMongoDB/Groups');
const Transactions = require('../../ModelsMongoDB/Transactions');

async function handle_request(message, callback) {
  const user = await Users.findOne({ _id: message.userId });
  const groupIds = user.joinedGroups;
  const memberGroups = await Groups.find({ _id: groupIds });
  const memberGroupsNames = memberGroups.map((memberGroup) => memberGroup.name);
  const { selectedGroup } = message;
  let groupTransactions = [];
  if (selectedGroup === 'All') {
    groupTransactions = await Transactions.find({ groupName: memberGroupsNames }).sort({ time: 'desc' });
  } else {
    groupTransactions = await Transactions.find({ groupName: selectedGroup }).sort({ time: 'desc' });
  }
  const { pageSize } = message;
  const paginationNumber = (groupTransactions.length / pageSize);
  callback(null, { paginationNumber: Math.ceil(paginationNumber) });
}

exports.handle_request = handle_request;
