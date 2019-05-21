const knex = require("../../db/knex");
const { CalorieType } = require("../types");

const {
  GraphQLNonNull,
  GraphQLInt
} = require("graphql");

const addCalorieSpent = {
  type: CalorieType,
  args: {
    amount: { type: new GraphQLNonNull(GraphQLInt) }
  },
  async resolve(parentValue, args, { me }) {
    if (me) {
      let currentSpent = await knex.select("id", "spent").table("calorie-spent").where("user_id", me.id)

      // If row doesn't exists
      if (currentSpent.length === 0) {
        await knex("calorie-spent").insert({ user_id: me.id, spent: 0 })
        currentSpent = await knex.select("id", "spent").table("calorie-spent").where("user_id", me.id)
      }

      let res = await knex("calorie-spent").where("user_id", '=', me.id).update({ spent: currentSpent[0].spent + args.amount }, ["id", "user_id", "spent"])
      return { id: res[0].id, user_id: res[0].user_id, amount: res[0].spent }
    } else {
      throw new Error("Not logged in!");
    }
  }
}

const subCalorieSpent = {
  type: CalorieType,
  args: {
    amount: { type: new GraphQLNonNull(GraphQLInt) }
  },
  async resolve(parentValue, args, { me }) {
    if (me) {
      let currentSpent = await knex.select("id", "spent").table("calorie-spent").where("user_id", me.id)

      // If row doesn't exists
      if (currentSpent.length === 0) {
        await knex("calorie-spent").insert({ user_id: me.id, spent: 0 })
        currentSpent = await knex.select("id", "spent").table("calorie-spent").where("user_id", me.id)
      }

      if (currentSpent[0].spent - args.amount < 0) {
        throw new Error("Cannot be less than 0");
      }

      let res = await knex("calorie-spent").where("user_id", '=', me.id).update({ spent: currentSpent[0].spent - args.amount }, ["id", "user_id", "spent"])
      return { id: res[0].id, user_id: res[0].user_id, amount: res[0].spent }
    } else {
      throw new Error("Not logged in!");
    }
  }
}

module.exports = { addCalorieSpent, subCalorieSpent };