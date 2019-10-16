exports.up = function(knex, Promise) {
  return knex.schema.createTable('book_to_collection', (table) => {
    table.increments();
    table.integer('book_id').notNullable();
    table.integer('collection_id').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('book_to_collection');
};
