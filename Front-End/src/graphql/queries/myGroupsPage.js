import gql from 'graphql-tag';

const getJoinedGroupDataQuery = gql`
query JoinedGroupData($userId: String) {
    joinedgroupdata(userId: $userId) {
        _id,
        name
  }
}
`;

const getInvitedGroupDataQuery = gql`
query InvitedGroupData($userId: String) {
    invitedgroupdata(userId: $userId) {
        groupId,
        groupName,
        creatorUser,
        creatorId
  }
}
`;

export { getJoinedGroupDataQuery, getInvitedGroupDataQuery };
