const { GraphQLObjectType } = require("graphql");

const { getCalorieIntake } = require("./getCalorieIntake");
const { getCalorieSpent } = require("./getCalorieSpent");
const { user_current } = require("./user_current");
const { user_all } = require("./user_all");
const { getFriends } = require("./getFriends");
const { calcRank } = require('./calcRank');

// Root query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user_all,
    user_current, // details of the current user
    getCalorieIntake,
    getCalorieSpent,
    getFriends,
    calcRank
  }
});

module.exports = RootQuery;