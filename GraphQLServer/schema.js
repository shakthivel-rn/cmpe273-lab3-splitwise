const { default: axios } = require('axios');
const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLFloat, GraphQLList, GraphQLSchema } = require('graphql');

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
                console.log('Group');
                return axios.get('http://localhost:3001/groupPage', { params: { userId, groupName } })
                    .then(res => res.data)
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
                return axios.get('http://localhost:3001/groupPage/getExpenseDetail', { params: { userId, groupName, expenseId } })
                    .then(res => res.data)
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
                return axios.get('http://localhost:3001/recentActivity', {
                    params: {
                        userId, pageNumber, pageSize, order, selectedGroup,
                    },
                })
                    .then(res => res.data)
            }
        },
        dashboarddata: {
            type: new GraphQLList(DashboardData),
            args: {
                userId: { type: GraphQLString },
            },
            resolve(parent, args) {
                const userId = args.userId;
                return axios.get('http://localhost:3001/dashboard/getTotalPaidAndOwedAmount', { params: { userId } }).then(res => res.data)
            }
        },
        youowedata: {
            type: new GraphQLList(YouOweData),
            args: {
                userId: { type: GraphQLString },
            },
            resolve(parent, args) {
                const userId = args.userId;
                return axios.get('http://localhost:3001/dashboard/getIndividualOwedAmount', { params: { userId } }).then(res => res.data)
            }
        },
        youareoweddata: {
            type: new GraphQLList(YouAreOwedData),
            args: {
                userId: { type: GraphQLString },
            },
            resolve(parent, args) {
                const userId = args.userId;
                return axios.get('http://localhost:3001/dashboard/getIndividualPaidAmount', { params: { userId } }).then(res => res.data)
            }
        }
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
                console.log(name);
                const data = {
                    name,
                    email,
                    password
                }
                return axios.post('http://localhost:3001/register', data)
                    .then(res => res.data);
            }
        },
        login: {
            type: GraphQLString,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parent, args) {
                const email = args.email;
                const password = args.password;
                const data = {
                    email,
                    password
                }
                return axios.post('http://localhost:3001/login', data)
                    .then(res => res.data);
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
                const data = {
                    userId,
                    memberEmails,
                    groupName
                }
                return axios.post('http://localhost:3001/createGroup', data)
                    .then(res => res.data);
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
                return axios.post('http://localhost:3001/createExpense', data)
                    .then(res => res.data);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
})

