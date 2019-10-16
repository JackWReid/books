exports.seed = function(knex, Promise) {
  return knex('user_to_book').del()
    .then(() => {
      return Promise.all([
        knex('user_to_book').insert({user_id: 1, book_id: 1, status: 'reading'}),
        knex('user_to_book').insert({user_id: 2, book_id: 2, status: 'reading'}),
        knex('user_to_book').insert({user_id: 1, book_id: 2, status: 'finished'}),
        knex('user_to_book').insert({user_id: 2, book_id: 1, status: 'finished'}),
      ]);
    });
};
