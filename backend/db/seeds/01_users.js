
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('user').del()
    .then(function () {
      // Inserts seed entries
      return knex('user').insert([
        { username: 'user1', password: "user1" },
        { username: 'user2', password: "user2" },
        { username: 'user3', password: "user3" },
        { username: 'user4', password: "user4" }
      ]);
    });
};
