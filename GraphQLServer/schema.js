const { default: axios } = require('axios');
const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLFloat, GraphQLList, GraphQLSchema } = require('graphql');
const { getGroupData } = require('./Handlers/GroupPage/getGroupData');
const { getExpenseData } = require('./Handlers/GroupPage/getExpenseDetails');
const { getRecentActivityData } = require('./Handlers/RecentActivity/getRecentActivity');
const { getDashboardData } = require('./Handlers/Dashboard/getDashboardBox');
const { getYouOweData } = require('./Handlers/Dashboard/getYouOwe');
const { getYouAreOwedData } = require('./Handlers/Dashboard/getYouAreOwed');
const { getJoinedGroupData } = require('./Handlers/Dashboard/getGroupNames');
const { getInvitedGroupData } = require('./Handlers/MyGroups/getInvitedGroups');

const { singUp } = require('./Handlers/User/register');
const { login } = require('./Handlers/User/login');
const { createGroup } = require('./Handlers/CreateGroup/createGroup');
const { createExpense } = require('./Handlers/CreateExpense/createExpense');

const GroupData = new GraphQLObjectType({
    name: 'GroupData',
    fields: () => ({
        expenseDescription: { type: GraphQLString },
        expenseId: { type: GraphQLString },
    })
});

const ExpenseData = new GraphQLObjectType({
    name: 'ExpenseData',
    fields: () => ({
        expenseAmount: { type: GraphQLInt },
        expenseName: { type: GraphQLString },
        owedUserName: { type: GraphQLString },
        paidUserName: { type: GraphQLString },
        splitAmount: { type: GraphQLFloat },
        status: { type: GraphQLString },
    })
});

const RecentActivityData = new GraphQLObjectType({
    name: 'RecentActivityData',
    fields: () => ({
        expenseAmount: { type: GraphQLInt },
        expenseName: { type: GraphQLString },
        groupName: { type: GraphQLString },
        owedUserName: { type: GraphQLString },
        paidUserName: { type: GraphQLString },
        splitAmount: { type: GraphQLFloat },
        status: { type: GraphQLString },
    })
});

const DashboardData = new GraphQLObjectType({
    name: 'DashboardData',
    fields: () => ({
        totalPaidAmount: { type: GraphQLFloat },
        totalOwedAmount: { type: GraphQLFloat },
    })
});

const YouOweData = new GraphQLObjectType({
    name: 'YouOweData',
    fields: () => ({
        groupName: { type: GraphQLString },
        paidUserName: { type: GraphQLString },
        individualOwedAmount: { type: GraphQLFloat },
    })
});

const YouAreOwedData = new GraphQLObjectType({
    name: 'YouAreOwedData',
    fields: () => ({
        groupName: { type: GraphQLString },
        owedUserName: { type: GraphQLString },
        individualPaidAmount: { type: GraphQLFloat },
    })
});

const JoinedGroupData = new GraphQLObjectType({
    name: 'JoinedGroupData',
    fields: () => ({
        _id: { type: GraphQLString },
        name: { type: GraphQLString },
    })
});

const InvitedGroupData = new GraphQLObjectType({
    name: 'InvitedGroupData',
    fields: () => ({
        groupId: { type: GraphQLString },
        groupName: { type: GraphQLString },
        creatorUser: { type: GraphQLString },
        creatorId: { type: GraphQLString },
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        groupdata: {
            type: new GraphQLList(GroupData),
            args: {
                userId: { type: GraphQLString },
                groupName: { type: GraphQLString }
            },
            resolve(parent, args) {
                const userId = args.userId;
                const groupName = args.groupName;
                return getGroupData(userId, groupName)
            }
        },
        expensedata: {
            type: new GraphQLList(ExpenseData),
            args: {
                userId: { type: GraphQLString },
                groupName: { type: GraphQLString },
                expenseId: { type: GraphQLString }
            },
            resolve(parent, args) {
                const userId = args.userId;
                const groupName = args.groupName;
                const expenseId = args.expenseId;
                return getExpenseData(userId, groupName, expenseId)
            }
        },
        recentactivitydata: {
            type: new GraphQLList(RecentActivityData),
            args: {
                userId: { type: GraphQLString },
                pageNumber: { type: GraphQLString },
                pageSize: { type: GraphQLString },
                order: { type: GraphQLString },
                selectedGroup: { type: GraphQLString },
            },
            resolve(parent, args) {
                const userId = args.userId;
                const pageNumber = args.pageNumber;
                const pageSize = args.pageSize;
                const order = args.order;
                const selectedGroup = args.selectedGroup;
                return getRecentActivityData(userId, pageNumber, pageSize, order, selectedGroup)
            }
        },
        dashboarddata: {
            type: new GraphQLList(DashboardData),
            args: {
                userId: { type: GraphQLString },
            },
            resolve(parent, args) {
                const userId = args.userId;
                return getDashboardData(userId)
            }
        },
        youowedata: {
            type: new GraphQLList(YouOweData),
            args: {
                userId: { type: GraphQLString },
            },
            resolve(parent, args) {
                const userId = args.userId;
                return getYouOweData(userId)
            }
        },
        youareoweddata: {
            type: new GraphQLList(YouAreOwedData),
            args: {
                userId: { type: GraphQLString },
            },
            resolve(parent, args) {
                const userId = args.userId;
                return getYouAreOwedData(userId)
            }
        },
        joinedgroupdata: {
            type: new GraphQLList(JoinedGroupData),
            args: {
                userId: { type: GraphQLString },
            },
            resolve(parent, args) {
                const userId = args.userId;
                return getJoinedGroupData(userId)
            }
        },
        invitedgroupdata: {
            type: new GraphQLList(InvitedGroupData),
            args: {
                userId: { type: GraphQLString },
            },
            resolve(parent, args) {
                const userId = args.userId;
                return getInvitedGroupData(userId)
            }
        },
    }
})

const RootMutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        signup: {
            type: GraphQLString,
            args: {
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parent, args) {
                const name = args.name;
                const email = args.email;
                const password = args.password;
                return singUp(name, email, password)
            }
        },
        login: {
            type: GraphQLString,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(parent, args) {
                const email = args.email;
                const password = args.password;
                const result = await login(email, password);
                console.log(result);
                return result
            }
        },
        creategroup: {
            type: GraphQLString,
            args: {
                userId: { type: GraphQLString },
                memberEmails: { type: GraphQLList(GraphQLString) },
                groupName: { type: GraphQLString }
            },
            resolve(parent, args) {
                const userId = args.userId;
                const memberEmails = args.memberEmails;
                const groupName = args.groupName;
                return createGroup(userId, memberEmails, groupName)
            }
        },
        createexpense: {
            type: GraphQLString,
            args: {
                userId: { type: GraphQLString },
                groupId: { type: GraphQLString },
                expenseDescription: { type: GraphQLString },
                expenseAmount: { type: GraphQLString }
            },
            resolve(parent, args) {
                const userId = args.userId;
                const groupId = args.groupId;
                const expenseDescription = args.expenseDescription;
                const expenseAmount = args.expenseAmount;
                const data = {
                    userId,
                    groupId,
                    expenseDescription,
                    expenseAmount
                }
                return createExpense(userId, groupId, expenseDescription, expenseAmount)
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
})

