exports.up = function(knex, Promise) {
  return knex.schema.createTable('collections', (table) => {
    table.increments();
    table.string('title').notNullable();
    table.text('description');
    table.integer('creator_user').notNullable();
    table.integer('book_count').notNullable().defaultTo(0);
    table.integer('followers').notNullable().defaultTo(0);
    table.string('created_at').notNullable().defaultTo(knex.raw('now()'));
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('collections');
};
