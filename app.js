const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const cors = require('cors');
// store config variables in dotenv
require('dotenv').config();
// ORM (Object-Relational Mapper library)
const Sequelize = require('sequelize');

const app = express();

// allow cross-origin requests
app.use(cors());

app.use("/graphql", graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(4000, () => {
  console.log("listening for requests on port 4000");
});
