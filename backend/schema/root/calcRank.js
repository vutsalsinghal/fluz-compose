const knex = require("../../db/knex");
const { GraphQLList } = require("graphql");
const { RankType } = require("../types");
const dijkstra = require('dijkstrajs')
const find_path = dijkstra.find_path;


module.exports = {
  calcRank: {
    type: GraphQLList(RankType),
    async resolve(parentValue, args, { me }) {
      if (!me) {
        throw new Error("Not logged in!");
      } else {
        let res = await knex('user')
          .join('calorie-intake', 'user.id', 'calorie-intake.user_id')
          .join('calorie-spent', 'user.id', 'calorie-spent.user_id')
          .select('user.id', 'username', 'intake', 'spent', knex.raw('intake-spent as variance'))
          .whereNot({ 'intake': 0 })
          .orderBy(['variance', { column: 'intake', order: 'desc' }])
          .limit(process.env.LIMIT_RANK)

        let frnds = await knex('friend')
          .where(knex.raw('user_id < friend_id'))
          .select('user_id', 'friend_id')
          .orderBy('user_id')

        let graph = {};
        for (let i = 0; i < frnds.length; i++) {
          let { user_id, friend_id } = frnds[i];
          if (graph[user_id]) {
            graph[user_id][[friend_id]] = 1;
          } else {
            graph[user_id] = { [friend_id]: 1 }
          }
        }

        for (let i = 0; i < res.length; i++) {
          try {
            let path = find_path(graph, me.id, res[i].id);
            res[i].separation = path.length - 1;
          } catch (e) {
            res[i].separation = -1;
          }
        }

        return res;
      }
    }
  }
}