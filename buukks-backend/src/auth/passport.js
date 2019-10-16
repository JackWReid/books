import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import knex from '../db/connection';

import { comparePasswords } from './helpers';

passport.use(new BasicStrategy((username, password, done) => {
  knex('users').where({username}).first()
  .then((user) => {
    if (!user) {return done(null, false);}
    if (!comparePasswords(password, user.password)) {return done(null, false);}
    else {return done(null, user);}
  })
  .catch((error) => {return done(error);});
}));

export default passport.authenticate('basic', {session: false});
