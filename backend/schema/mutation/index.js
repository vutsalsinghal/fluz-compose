const knex = require("../../db/knex");
const _ = require("lodash")

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull
} = require("graphql");

const register = require("./register");
const login = require("./login");
const logout = require("./logout");
const { addCalorieIntake, subCalorieIntake } = require("./calorieIntake");
const { addCalorieSpent, subCalorieSpent } = require("./calorieSpent");
const addFriend = require("./addFriend");

const mutationQuery = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    register,
    login,
    logout,
    addCalorieIntake,
    subCalorieIntake,
    addCalorieSpent,
    subCalorieSpent,
    addFriend,
  }
});

module.exports = mutationQuery;