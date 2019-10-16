exports.seed = function(knex, Promise) {
  return knex('reviews').del()
    .then(() => {
      return Promise.all([
        knex('reviews').insert({user_id: 1, book_id: 1, rating: 3, review: 'Not bad huh'}),
        knex('reviews').insert({user_id: 2, book_id: 2, rating: 5, review: 'Greatest of all time'}),
      ]);
    });
};
