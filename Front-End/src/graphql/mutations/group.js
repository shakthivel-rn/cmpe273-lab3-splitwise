import gql from 'graphql-tag';

const createGroupMutation = gql`
mutation CreateGroup($userId: String, $memberEmails: [String], $groupName: String) {
    creategroup(userId:$userId, memberEmails: $memberEmails, groupName:$groupName)
}
`;

export default createGroupMutation;
