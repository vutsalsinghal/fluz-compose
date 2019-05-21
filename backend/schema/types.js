const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} = require("graphql");

// UserType
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    token: { type: GraphQLString }
  })
});

const CalorieType = new GraphQLObjectType({
  name: "Calorie",
  fields: () => ({
    id: { type: GraphQLString },
    user_id: { type: GraphQLInt },
    amount: { type: GraphQLInt },
  })
});

const RankType = new GraphQLObjectType({
  name: "Rank",
  fields: () => ({
    username: { type: GraphQLString },
    intake: { type: GraphQLInt },
    spent: { type: GraphQLInt },
    variance: { type: GraphQLInt },
    separation: { type: GraphQLInt }
  })
});


module.exports = { UserType, CalorieType, RankType };