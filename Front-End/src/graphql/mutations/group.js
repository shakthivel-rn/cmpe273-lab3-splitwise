import gql from 'graphql-tag';

const createGroupMutation = gql`
mutation CreateGroup($userId: String, $memberEmails: [String], $groupName: String) {
    creategroup(userId:$userId, memberEmails: $memberEmails, groupName:$groupName)
}
`;

const createExpenseMutation = gql`
mutation CreateExpense($userId: String, $groupId: String, $expenseDescription: String, $expenseAmount: String) {
    createexpense(userId: $userId, groupId: $groupId, expenseDescription: $expenseDescription, expenseAmount: $expenseAmount)
}
`;

export { createGroupMutation, createExpenseMutation };
