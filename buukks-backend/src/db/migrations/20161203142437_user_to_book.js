exports.up = function(knex, Promise) {
  return knex.schema.createTable('user_to_book', (table) => {
    table.increments();
    table.integer('user_id').notNullable();
    table.integer('book_id').notNullable();
    table.string('status').notNullable();
    table.boolean('muted').notNullable().defaultTo(false);
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('user_to_book');
};
