import gql from 'graphql-tag';

const settleAmountMutation = gql`
mutation SettleAmount($userId: String, $friendId: String) {
    settleAmount(userId:$userId, friendId:$friendId)
}
`;

export default settleAmountMutation;
