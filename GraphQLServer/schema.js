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

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        groupdata: {
            type: new GraphQLList(GroupData),
            args: {
                userId: {type: GraphQLString},
                groupName: {type: GraphQLString}
            },
            resolve(parent, args) {
                const userId = args.userId;
                const groupName = args.groupName;
                return axios.get('http://localhost:3001/groupPage', { params: { userId, groupName } })
                    .then(res => res.data)
            }
        },
        expensedata: {
            type: new GraphQLList(ExpenseData),
            args: {
                userId: {type: GraphQLString},
                groupName: {type: GraphQLString},
                expenseId: {type: GraphQLString}
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
                userId: {type: GraphQLString},
                pageNumber: {type: GraphQLString},
                pageSize: {type: GraphQLString},
                order: {type: GraphQLString},
                selectedGroup: {type: GraphQLString},
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
        }
    }
})

const RootMutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        signup: {
            type: GraphQLString,
            args:{
                name: {type: GraphQLString},
                email: {type: GraphQLString},
                password: {type: GraphQLString}
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
            args:{
                email: {type: GraphQLString},
                password: {type: GraphQLString}
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
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
})

