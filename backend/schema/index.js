require('dotenv').config()
const mutationQuery = require("./mutation");
const RootQuery = require("./root");

const { GraphQLSchema } = require("graphql");

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutationQuery
});