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
  async resolve(parentValue, args, { me }) {
    if (me) {
      let currentIntake = await knex.select("id", "intake").table("calorie-intake").where("user_id", me.id)

      // If row doesn't exists
      if (currentIntake.length === 0) {
        await knex("calorie-intake").insert({ user_id: me.id, intake: 0 })
        currentIntake = await knex.select("id", "intake").table("calorie-intake").where("user_id", me.id)
      }

      let res = await knex("calorie-intake").where("user_id", '=', me.id).update({ intake: currentIntake[0].intake + args.amount }, ["id", "user_id", "intake"])
      return { id: res[0].id, user_id: res[0].user_id, amount: res[0].intake }
    } else {
      throw new Error("Not logged in!");
    }
  }
}

const subCalorieIntake = {
  type: CalorieType,
  args: {
    amount: { type: new GraphQLNonNull(GraphQLInt) }
  },
  async resolve(parentValue, args, { me }) {
    if (me) {
      let currentIntake = await knex.select("id", "intake").table("calorie-intake").where("user_id", me.id)

      // If row doesn't exists
      if (currentIntake.length === 0) {
        await knex("calorie-intake").insert({ user_id: me.id, intake: 0 })
        currentIntake = await knex.select("id", "intake").table("calorie-intake").where("user_id", me.id)
      }

      if (currentIntake[0].intake - args.amount < 0) {
        throw new Error("Cannot be less than 0");
      }

      let res = await knex("calorie-intake").where("user_id", '=', me.id).update({ intake: currentIntake[0].intake - args.amount }, ["id", "user_id", "intake"])
      return { id: res[0].id, user_id: res[0].user_id, amount: res[0].intake }
    } else {
      throw new Error("Not logged in!");
    }
  }
}

module.exports = { addCalorieIntake, subCalorieIntake };