const knex = require("../../db/knex");
const { UserType } = require("../types");

const { GraphQLList } = require("graphql");

module.exports = {
  getFriends: {
    type: new GraphQLList(UserType),
    async resolve(parentValue, args, { me }) {
      if (!me) {
        throw new Error("Not logged in!");
      } else {
        let friends = await knex.select("friend_id").table("friend").where("user_id", me.id)
        let result = [];
        for (let i = 0; i < friends.length; i++) {
          let res = await knex.select().table("user").where("id", friends[i].friend_id)
          result.push({ id: res[0].id, username: res[0].username });
        }
        return result
      }
    }
  }
}