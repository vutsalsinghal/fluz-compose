const { GraphQLString } = require("graphql");

const logout = {
  type: GraphQLString,
  async resolve(parentValue, args, { me }) {
    if (!me) {
      throw new Error("Not logged in!");
    }

    return "Successfully Logged out!"
  }
}

module.exports = logout;