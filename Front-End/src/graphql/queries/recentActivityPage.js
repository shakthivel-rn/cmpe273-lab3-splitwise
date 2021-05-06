import gql from 'graphql-tag';

const getRecentActivityDataQuery = gql`
query RecentActivityData($userId: String, $pageNumber: String, $pageSize: String, $order: String, $selectedGroup: String) {
    recentactivitydata(userId: $userId, pageNumber: $pageNumber, pageSize: $pageSize, order: $order, selectedGroup: $selectedGroup) {
        expenseName,
        expenseAmount,
        groupName,
        owedUserName,
        paidUserName,
        splitAmount,
        status
      }
}
`;

export default getRecentActivityDataQuery;
