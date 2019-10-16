exports.seed = function(knex, Promise) {
  return knex('book_to_collection').del()
    .then(() => {
      return Promise.all([
        knex('book_to_collection').insert({book_id: 1, collection_id: 2}),
        knex('collections').where({id: 2}).increment('book_count', 1),
        knex('book_to_collection').insert({book_id: 2, collection_id: 1}),
        knex('collections').where({id: 1}).increment('book_count', 1),
      ]);
    });
};
