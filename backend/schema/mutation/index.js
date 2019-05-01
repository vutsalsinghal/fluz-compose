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
const addCalorieIntake = require("./addCalorieIntake");
const addCalorieSpent = require("./addCalorieSpent");

const mutationQuery = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    register,
    login,
    logout,
    addCalorieIntake,
    addCalorieSpent,
    addfriend: {
      type: GraphQLString,
      args: {
        fid: { type: new GraphQLNonNull(GraphQLInt) }
      },
      async resolve(parentValue, args, { session }) {
        if (session.user) {
          if (session.user.id == args.fid) {
            throw new Error("uid cannot be equal to fid!");
          } else {
            let isFriend = await knex.select("user_id", "friend_id").table("friend").where({ user_id: session.user.id, friend_id: args.fid })
            if (isFriend.length === 1) {
              throw new Error("Is an existing friend!");
            } else {
              await knex("friend").insert({ user_id: session.user.id, friend_id: args.fid })
              await knex("friend").insert({ user_id: args.fid, friend_id: session.user.id })
            }
          }
          return "Friend added!"
        } else {
          throw new Error("Not logged in!");
        }
      }
    }
  }
});

module.exports = mutationQuery;