import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: 'http://localhost:5001/graphql',
});

export default client;
