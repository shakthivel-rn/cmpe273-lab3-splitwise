import gql from 'graphql-tag';

const getDashboardDataQuery = gql`
query DashboardData($userId: String) {
    dashboarddata(userId: $userId) {
        totalOwedAmount,
        totalPaidAmount
  }
}
`;

const getYouOweDataQuery = gql`
query YouOweData($userId: String) {
    youowedata(userId: $userId) {
        groupName,
        paidUserName,
        individualOwedAmount
  }
}
`;

const getYouAreOwedData = gql`
query YouAreOwedData($userId: String) {
    youareoweddata(userId: $userId) {
        groupName,
        owedUserName,
        individualPaidAmount
  }
}
`;

export { getDashboardDataQuery, getYouOweDataQuery, getYouAreOwedData };
