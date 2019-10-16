exports.up = function(knex, Promise) {
  return knex.schema.createTable('reviews', (table) => {
    table.increments();
    table.integer('user_id').notNullable();
    table.integer('book_id').notNullable();
    table.integer('rating').notNullable();
    table.string('review');
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('reviews');
};
