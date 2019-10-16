exports.up = function(knex, Promise) {
  return knex.schema.createTable('user_to_user', (table) => {
    table.increments();
    table.integer('follower').notNullable();
    table.integer('followee').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('user_to_user');
};
