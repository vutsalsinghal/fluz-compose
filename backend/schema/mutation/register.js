const knex = require("../../db/knex");
const { UserType } = require("../types");
const jwt = require('jsonwebtoken');

const {
  GraphQLString,
  GraphQLNonNull
} = require("graphql");

const createToken = async (user, secret, expiresIn) => {
  const { id, username } = user;
  return await jwt.sign({ id, username }, secret, { expiresIn });
};

const register = {
  type: UserType,
  args: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) }
  },
  async resolve(parentValue, args, { me, request, jwt_secret }) {
    if (!me) {
      let res;

      try {
        res = await knex("user").insert({ username: args.username, password: args.password }, ["id", "username", "password"])
      } catch (e) {
        throw new Error("Username exists!");
      }

      await knex("calorie-intake").insert({ user_id: res[0].id, intake: 0 })
      await knex("calorie-spent").insert({ user_id: res[0].id, spent: 0 })
      const token = createToken({ id: res[0].id, username: res[0].username }, jwt_secret, process.env.JWT_EXPIRES);
      return { username: res[0].username, id: res[0].id, password: res[0].password, token }
    } else {
      throw new Error("Already registered/loggedin!");
    }
  }
}

module.exports = register;