const bcrypt = require('bcryptjs');

exports.seed = (knex, Promise) => {
  return knex('users').del()
  .then(() => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync('johnson123', salt);
    return Promise.join(
      knex('users').insert({
        username: 'jeremy',
        password: hash,
        first_name: 'Jeremy',
        last_name: 'Johnson',
        email: 'jeremy@place.com',
      })
    );
  })
  .then(() => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync('bryant123', salt);
    return Promise.join(
      knex('users').insert({
        username: 'kelly',
        password: hash,
        first_name: 'Kelly',
        last_name: 'Bryant',
        admin: true,
        email: 'kelly@place.com',
      })
    );
  });
};
