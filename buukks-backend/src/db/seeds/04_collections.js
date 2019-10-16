exports.seed = (knex, Promise) => {
  return knex('collections').del()
  .then(() => {
    return Promise.join(
      knex('collections').insert({
        title: 'World War I',
        description: 'Books about The Great War',
        creator_user: 1,
      })
    );
  })
  .then(() => {
    return Promise.join(
      knex('collections').insert({
        title: 'U.S. Civil Rights',
        description: 'Fight the powers that be',
        creator_user: 2,
      })
    );
  });
};
