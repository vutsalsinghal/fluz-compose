const knex = require("../../db/knex");
const { CalorieType } = require("../types");

module.exports = {
  getCalorieIntake: {
    type: CalorieType,
    async resolve(parentValue, args, { me }) {
      if (!me) {
        throw new Error("Not logged in!");
      } else {
        let res = await knex.select().table("calorie-intake").where("user_id", me.id)
        return { id: res[0].id, user_id: res[0].user_id, amount: res[0].intake }
      }
    }
  }
}