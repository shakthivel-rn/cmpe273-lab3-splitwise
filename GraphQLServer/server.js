const express = require('express')
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const schema = require('./schema');
const mongoose = require('mongoose');
const { mongoDB } = require('./Utils/config');

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 500,
  bufferMaxEntries: 0,
};

mongoose.connect(mongoDB, options, (err) => {
  if (err) {
    console.log(err);
    console.log('MongoDB Connection Failed');
  } else {
    console.log('MongoDB Connected');
  }
});

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);

app.listen(5001, () => console.log(`Server started on port 5001`));