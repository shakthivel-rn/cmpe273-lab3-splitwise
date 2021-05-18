import gql from 'graphql-tag';

const getUserDataQuery = gql`
query UserData($userId: String) {
    userdata(userId: $userId) {
        name,
        email,
        phoneNumber,
        language,
        defaultCurrency,
        timezone
  }
}
`;

export default getUserDataQuery;
