const express = require('express')
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const schema = require('./schema');

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);

app.listen(5001, () => console.log(`Server started on port 5001`));