require('dotenv').config()
const { GraphQLSchema } = require("graphql");
const mutationQuery = require("./mutation");
const RootQuery = require("./root");

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutationQuery
});