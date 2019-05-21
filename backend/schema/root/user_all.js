const knex = require("../../db/knex");
const { UserType } = require("../types");

const { GraphQLList } = require("graphql");

module.exports = {
  user_all: {
    type: new GraphQLList(UserType),
    async resolve(parentValue, args) {
      var res = await knex.select().table("user")
      return res
    }
  }
}