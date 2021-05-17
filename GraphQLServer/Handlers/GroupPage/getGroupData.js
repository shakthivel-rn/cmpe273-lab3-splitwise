/* eslint-disable camelcase */
const Transactions = require('../../ModelsMongoDB/Transactions');

async function getGroupData(userId, groupName) {
  const transactions = await Transactions.find({ groupName: groupName },
    { expenseId: 1, expenseDescription: 1 }).sort({ time: 'desc' });
  const result = transactions.map((transaction) => ({
    expenseId: transaction.expenseId,
    expenseDescription: transaction.expenseDescription,
  }));
  const uniq = new Set(result.map((e) => JSON.stringify(e)));
  const uniqueResult = Array.from(uniq).map((e) => JSON.parse(e));
  return uniqueResult;
}

exports.getGroupData = getGroupData;

