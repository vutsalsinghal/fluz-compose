const jwt = require('jsonwebtoken');
const knex = require("../../db/knex");
const { UserType } = require("../types");

const { GraphQLString, GraphQLNonNull } = require("graphql");

const createToken = async (user, secret, expiresIn) => {
  const { id, username } = user;
  return await jwt.sign({ id, username }, secret, { expiresIn });
};

const login = {
  type: UserType,
  args: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) }
  },
  async resolve(parentValue, args, { me, request, jwt_secret }) {
    console.log('in login: ', me);

    let checkUser = await knex.select().table("user").where("username", args.username)
    if (me) {
      throw new Error("Already Logged in!");
    } else if (!checkUser.length > 0) {
      throw new Error("User doesn't exist!");
    } else if (checkUser[0].password !== args.password) {
      throw new Error("Password doesn't match");
    }

    const token = createToken({ id: checkUser[0].id, username: checkUser[0].username }, jwt_secret, process.env.JWT_EXPIRES);
    return { username: checkUser[0].username, id: checkUser[0].id, token }
  }
}

module.exports = login