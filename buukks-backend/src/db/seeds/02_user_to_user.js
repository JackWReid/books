exports.seed = function(knex, Promise) {
  return knex('user_to_user').del()
    .then(() => {
      return Promise.all([
        knex('user_to_user').insert({follower: 1, followee: 2}),
        knex('users').where({id: 1}).increment('following', 1),
        knex('users').where({id: 2}).increment('followers', 1),
        knex('user_to_user').insert({follower: 2, followee: 1}),
        knex('users').where({id: 2}).increment('following', 1),
        knex('users').where({id: 1}).increment('followers', 1),
      ]);
    });
};
