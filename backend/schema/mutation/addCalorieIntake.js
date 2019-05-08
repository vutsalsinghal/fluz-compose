const knex = require("../../db/knex");
const { CalorieType } = require("../types");

const {
  GraphQLNonNull,
  GraphQLInt
} = require("graphql");

const addCalorieIntake = {
  type: CalorieType,
  args: {
    amount: { type: new GraphQLNonNull(GraphQLInt) }
  },
  async resolve(parentValue, args, { session }) {
    if (session.user) {
      let currentIntake = await knex.select("id", "intake").table("calorie-intake").where("user_id", session.user.id)
      let res = await knex("calorie-intake").where("user_id", '=', session.user.id).update({ intake: currentIntake[0].intake + args.amount }, ["id", "user_id", "intake"])
      return { id: res[0].id, user_id: res[0].user_id, amount: res[0].intake }
    } else {
      throw new Error("Not logged in!");
    }
  }
}

module.exports = addCalorieIntake;