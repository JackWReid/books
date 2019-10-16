exports.up = function(knex, Promise) {
  return knex.schema.createTable('books', (table) => {
    table.increments();
    table.string('google_id').unique().notNullable();
    table.text('image_url');
    table.string('title').notNullable();
    table.string('author').notNullable();
    table.text('description');
    table.integer('register_user').notNullable();
    table.string('created_at').notNullable().defaultTo(knex.raw('now()'));
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('books');
};
