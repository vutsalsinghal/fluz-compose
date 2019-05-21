const knex = require("../../db/knex");
const { UserType } = require("../types");

module.exports = {
  user_current: {
    type: UserType,
    async resolve(parentValue, args, { me }) {
      if (!me.username) {
        throw new Error("Not logged in!");
      } else {
        const res = await knex.select().table("user").where("id", me.id)
        return res[0]
      }
    }
  }
}