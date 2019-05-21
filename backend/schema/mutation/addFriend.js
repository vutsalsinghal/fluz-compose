const jwt = require('jsonwebtoken');
const knex = require("../../db/knex");
const { UserType } = require("../types");

const { GraphQLString, GraphQLNonNull } = require("graphql");

const createToken = async (user, secret, expiresIn) => {
  const { id, username } = user;
  return await jwt.sign({ id, username }, secret, { expiresIn });
};

const addFriend = {
  type: UserType,
  args: {
    username: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parentValue, args, { me }) {
    if (me) {
      let checkUser = await knex.select().table("user").where("username", args.username)

      if (!checkUser.length > 0) {
        throw new Error("User doesn't exist!");
      }
      await knex("friend").insert({ user_id: me.id, friend_id: checkUser[0].id })
      await knex("friend").insert({ user_id: checkUser[0].id, friend_id: me.id })
      return { username: checkUser[0].username, id: checkUser[0].id }
    } else {
      throw new Error("Not logged in!");
    }
  }
}

module.exports = addFriend