import gql from 'graphql-tag';

const getGroupDataQuery = gql`
query GroupData($userId: String, $groupName: String) {
  groupdata(userId: $userId,groupName: $groupName ) {
    expenseId,
    expenseDescription
  }
}
`;

const getExpenseDataQuery = gql`
query ExpenseData($userId: String, $groupName: String, $expenseId: String) {
  expensedata(userId: $userId, groupName: $groupName, expenseId:$expenseId){
    expenseName,
    expenseAmount,
    owedUserName,
    paidUserName,
    splitAmount,
    status
  }
}
`;

export { getGroupDataQuery, getExpenseDataQuery };
